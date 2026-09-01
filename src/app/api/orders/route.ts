import { NextResponse } from "next/server";
import { renderAgreementPdf } from "@/lib/agreement-pdf";
import { sendOrderMail } from "@/lib/mailer";
import type { AgreementDraft } from "@/lib/types";

/**
 * Every submission on the site lands here and is forwarded to the Google Sheet
 * that acts as the order book. Nothing is charged online — an operator reads
 * the row, calls to confirm, and takes payment on that call.
 *
 * The Apps Script URL is held server-side on purpose. Posting to it straight
 * from the browser would put a writable endpoint in the page source for anyone
 * to flood, and Apps Script does not send CORS headers for a cross-origin POST
 * anyway.
 *
 * A completed agreement is also emailed to the office with the deed attached as
 * a PDF, so an operator can print it onto stamp paper and courier it. The sheet
 * is the durable record and comes first — mail is best-effort on top, because a
 * mail failure must not tell a customer their order did not go through when it
 * is already in the order book.
 *
 * Set up: docs/google-sheet-webhook.md and docs/order-email.md
 */
export const runtime = "nodejs";

const WEBHOOK = process.env.SHEETS_WEBHOOK_URL;

/** Long enough for an Apps Script cold start, short enough not to hang a form. */
const TIMEOUT_MS = 10_000;

export async function POST(request: Request) {
  let payload: Record<string, unknown>;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Malformed request." }, { status: 400 });
  }

  const phone = String(payload.contactPhone ?? "").replace(/\D/g, "");
  if (phone.length < 10) {
    return NextResponse.json(
      { ok: false, error: "A ten-digit mobile number is needed so we can call you back." },
      { status: 422 },
    );
  }

  if (!WEBHOOK) {
    // Loud, and a failure rather than a silent success — an order that never
    // reached the sheet is an order nobody will ever call about.
    console.error(
      "[orders] SHEETS_WEBHOOK_URL is not set — submission was NOT recorded. See docs/google-sheet-webhook.md",
    );
    return NextResponse.json(
      { ok: false, error: "not-configured" },
      { status: 503 },
    );
  }

  // The draft rides along for the PDF but must not reach the sheet — a whole
  // agreement as JSON in one cell makes the order book unreadable.
  const flat = { ...(payload as Record<string, unknown>) };
  delete flat.draft;
  const row = {
    ...flat,
    contactPhone: phone,
    submittedAt: new Date().toISOString(),
    source: request.headers.get("referer") ?? "",
  };

  try {
    const response = await fetch(WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(row),
      signal: AbortSignal.timeout(TIMEOUT_MS),
      // Apps Script answers a POST with a 302 to script.googleusercontent.com.
      redirect: "follow",
    });

    if (!response.ok) {
      console.error("[orders] sheet rejected the row", response.status, await response.text());
      return NextResponse.json({ ok: false, error: "sheet-rejected" }, { status: 502 });
    }

    // The sheet has it. Anything after this point is a bonus, never a failure.
    const emailed = await mailOrder(payload);
    return NextResponse.json({ ok: true, emailed });
  } catch (error) {
    console.error("[orders] could not reach the sheet", error);
    return NextResponse.json({ ok: false, error: "unreachable" }, { status: 502 });
  }
}

/**
 * Emails the order to the desk, with the drafted agreement attached when the
 * submission carries one. Swallows its own errors by design — see above.
 */
async function mailOrder(payload: Record<string, unknown>): Promise<boolean> {
  try {
    const draft = payload.draft as AgreementDraft | undefined;
    const ref = String(payload.reference ?? "");
    const who = String(payload.contactName ?? "Someone");
    const phone = String(payload.contactPhone ?? "");
    const isAgreement = payload.kind === "agreement";

    const lines = [
      `${who} — ${phone}`,
      String(payload.summary ?? ""),
      payload.city ? `Property in ${payload.city}` : "",
      payload.estimate ? `Estimate: Rs ${payload.estimate}` : "",
      payload.notes ? `\nNotes: ${payload.notes}` : "",
      "",
      isAgreement
        ? "The drafted agreement is attached. Print it on stamp paper of the right value, get it signed, and courier it."
        : "This is an enquiry, not a drafted agreement. Call to find out what they need.",
      "",
      `Recorded at ${new Date().toLocaleString("en-IN")}.`,
    ].filter(Boolean);

    const attachment =
      isAgreement && draft?.id
        ? { filename: `${ref || draft.id}.pdf`, content: await renderAgreementPdf(draft) }
        : undefined;

    return await sendOrderMail({
      subject: isAgreement
        ? `Agreement ${ref} — ${who}, ${phone}`
        : `Enquiry — ${who}, ${phone}`,
      text: lines.join("\n"),
      attachment,
    });
  } catch (error) {
    console.error("[orders] order email failed", error);
    return false;
  }
}
