import { NextResponse } from "next/server";
import { renderAgreementPdf } from "@/lib/agreement-pdf";
import { sendOrderMail } from "@/lib/mailer";
import { orderEmailText, type OrderRow } from "@/lib/orders";
import type { AgreementDraft } from "@/lib/types";

/**
 * Every submission on the site lands here and is emailed to the order desk.
 * Nothing is charged online — an operator reads the mail, calls to confirm, and
 * takes payment on that call.
 *
 * Mail is the whole record. There was a Google Sheet alongside it, written
 * through an Apps Script webhook; it is gone, and with it the failure mode
 * where an unset webhook URL returned 503 before the mailer was ever reached.
 * Because the mail is now the only copy, it carries the entire row rather than
 * a six-line summary pointing at a spreadsheet — see orderEmailText.
 *
 * A drafted agreement rides along with the deed attached as a PDF, so an
 * operator can print it onto stamp paper and courier it. Nothing goes to the
 * customer: the finished instrument is the thing being paid for.
 *
 * Set up: docs/order-email.md
 */
export const runtime = "nodejs";

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

  // The draft rides along for the PDF but is not part of the row itself.
  const { draft, ...flat } = payload as { draft?: AgreementDraft } & Record<string, unknown>;
  // The body is whatever the browser posted, so it is checked at the edge and
  // then treated as the row it claims to be — orderEmailText reads it key by
  // key and simply skips anything absent.
  const row = {
    ...flat,
    contactPhone: phone,
    source: request.headers.get("referer") ?? "",
  } as unknown as OrderRow;

  const sent = await mailOrder(row, draft);
  if (!sent) {
    // The only copy failed, so the form has to say so — telling someone their
    // order is in when nothing recorded it is how a lead disappears silently.
    return NextResponse.json({ ok: false, error: "unreachable" }, { status: 502 });
  }
  return NextResponse.json({ ok: true, emailed: true });
}

/** Emails the order, with the drafted agreement attached when there is one. */
async function mailOrder(row: OrderRow, draft?: AgreementDraft): Promise<boolean> {
  try {
    const ref = String(row.reference ?? "");
    const who = String(row.contactName ?? "Someone");
    const phone = String(row.contactPhone ?? "");
    const isAgreement = row.kind === "agreement";

    const attachment =
      isAgreement && draft?.id
        ? { filename: `${ref || draft.id}.pdf`, content: await renderAgreementPdf(draft) }
        : undefined;

    return await sendOrderMail({
      subject: isAgreement
        ? `Agreement ${ref} — ${who}, ${phone}`
        : `Enquiry — ${who}, ${phone}`,
      text: orderEmailText(row),
      attachment,
    });
  } catch (error) {
    console.error("[orders] order email failed", error);
    return false;
  }
}
