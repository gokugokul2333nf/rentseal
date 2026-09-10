import { NextResponse } from "next/server";
import { renderAgreementPdf } from "@/lib/agreement-pdf";
import { sendOrderMail } from "@/lib/mailer";
import { sendTelegramNotice } from "@/lib/telegram";
import { orderEmailText, type OrderRow } from "@/lib/orders";
import type { AgreementDraft } from "@/lib/types";

/**
 * Every submission on the site lands here and is emailed to the order desk.
 * Nothing is charged online — an operator reads the mail, calls to confirm, and
 * takes payment on that call.
 *
 * Two channels carry it. Mail is the record: the whole row, the deed as a PDF,
 * something searchable months later. Telegram is the nudge — an operator does
 * not watch an inbox, but a phone buzzes. A lead is safe if either caught it.
 *
 * There was a Google Sheet here once, written through an Apps Script webhook.
 * It is gone, and with it the failure mode where an unset webhook URL returned
 * 503 before the mailer was reached.
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

  /*
    Two channels again, and deliberately unalike.

    Mail is the record — the whole row, the PDF, something searchable months
    later. Telegram is the nudge: an operator does not watch an inbox, but a
    phone buzzes. They also fail for different reasons, which is the point. When
    the sheet was removed mail became the only copy, so SMTP being down took the
    order form with it; a bot on a different network and a different credential
    puts that redundancy back.

    A lead is safe if either caught it. It fails only when neither did.
  */
  const pdf = await agreementPdf(row, draft);
  const [emailed, notified] = await Promise.all([
    mailOrder(row, pdf),
    notifyTelegram(row, pdf),
  ]);

  if (!emailed && !notified) {
    // Telling someone their order is in when nothing recorded it is how a lead
    // disappears silently.
    return NextResponse.json({ ok: false, error: "unreachable" }, { status: 502 });
  }
  if (!emailed) console.error("[orders] notified on Telegram but NOT emailed — no durable record");
  if (!notified) console.error("[orders] emailed but Telegram notification failed");
  return NextResponse.json({ ok: true, emailed, notified });
}

/**
 * The deed as a PDF, rendered once and handed to both channels.
 *
 * It used to be rendered inside the mailer. Now that two things want it,
 * rendering it twice would double the slowest part of the request for no gain.
 */
async function agreementPdf(
  row: OrderRow,
  draft?: AgreementDraft,
): Promise<{ filename: string; content: Buffer } | undefined> {
  if (row.kind !== "agreement" || !draft?.id) return undefined;
  try {
    return {
      filename: `${String(row.reference ?? "") || draft.id}.pdf`,
      content: await renderAgreementPdf(draft),
    };
  } catch (error) {
    // A deed that will not render must not sink the lead — the office can
    // redraw it from the details in the message.
    console.error("[orders] could not render the agreement PDF", error);
    return undefined;
  }
}

/** Buzzes the order desk. Never throws; the mail is the durable copy. */
async function notifyTelegram(
  row: OrderRow,
  pdf?: { filename: string; content: Buffer },
): Promise<boolean> {
  try {
    const who = String(row.contactName ?? "Someone");
    const phone = String(row.contactPhone ?? "");
    const heading =
      row.kind === "agreement"
        ? `NEW AGREEMENT — ${who}, ${phone}`
        : `NEW ENQUIRY — ${who}, ${phone}`;
    return await sendTelegramNotice({
      text: `${heading}\n\n${orderEmailText(row)}`,
      document: pdf,
    });
  } catch (error) {
    console.error("[orders] telegram notification failed", error);
    return false;
  }
}

/** Emails the order, with the drafted agreement attached when there is one. */
async function mailOrder(
  row: OrderRow,
  pdf?: { filename: string; content: Buffer },
): Promise<boolean> {
  try {
    const ref = String(row.reference ?? "");
    const who = String(row.contactName ?? "Someone");
    const phone = String(row.contactPhone ?? "");

    return await sendOrderMail({
      subject:
        row.kind === "agreement"
          ? `Agreement ${ref} — ${who}, ${phone}`
          : `Enquiry — ${who}, ${phone}`,
      text: orderEmailText(row),
      attachment: pdf,
    });
  } catch (error) {
    console.error("[orders] order email failed", error);
    return false;
  }
}
