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
 * Every lead is also emailed — enquiries and completed drafts alike — with the
 * deed attached as a PDF where there is one, so an operator can print it onto
 * stamp paper and courier it.
 *
 * The two are independent. A lead is safe if it reached either the sheet or the
 * mailbox, and the customer is only told to ring us when it reached neither.
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

  /*
    Two independent channels, tried side by side.

    The sheet used to gate the mail: if SHEETS_WEBHOOK_URL was unset the request
    returned 503 before the mailer was reached, and a sheet that rejected a row
    lost the lead entirely even with SMTP working perfectly. One misconfigured
    integration silently disabled the other, which is the opposite of what two
    records are for.

    So both run, and the submission succeeds if either one caught it. It only
    fails — and only then does the form tell the customer to ring us — when the
    lead reached neither the order book nor the mailbox.
  */
  const [recorded, emailed] = await Promise.all([
    postToSheet(row),
    mailOrder(payload),
  ]);

  if (!recorded && !emailed) {
    console.error("[orders] the lead reached neither the sheet nor the mailbox");
    return NextResponse.json({ ok: false, error: "unreachable" }, { status: 502 });
  }
  if (!recorded) {
    // Worth shouting about: the mail went, so nothing is lost, but the order
    // book is now missing a row that every later report counts from.
    console.error("[orders] emailed but NOT recorded in the sheet");
  }
  return NextResponse.json({ ok: true, recorded, emailed });
}

/** Appends the row to the order sheet. False on any failure — never throws. */
async function postToSheet(row: Record<string, unknown>): Promise<boolean> {
  if (!WEBHOOK) {
    console.error(
      "[orders] SHEETS_WEBHOOK_URL is not set — nothing was recorded in the sheet. See docs/google-sheet-webhook.md",
    );
    return false;
  }
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
      return false;
    }
    return true;
  } catch (error) {
    console.error("[orders] could not reach the sheet", error);
    return false;
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
