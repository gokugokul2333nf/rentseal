import nodemailer from "nodemailer";

/**
 * Outbound mail for the order desk.
 *
 * Every completed draft is emailed to the office with the agreement attached as
 * a PDF, so an operator can print it onto stamp paper and courier it. Nothing
 * is sent to the customer: the finished instrument is the thing being paid for,
 * and handing it over before the confirming call would give it away.
 *
 * Set up: docs/order-email.md
 */

const HOST = process.env.SMTP_HOST;
const PORT = Number(process.env.SMTP_PORT ?? 465);
const USER = process.env.SMTP_USER;
const PASS = process.env.SMTP_PASS;
/** Where orders land. Falls back to the address on the site. */
const TO = process.env.ORDER_EMAIL || process.env.SMTP_USER;

export const mailConfigured = Boolean(HOST && USER && PASS && TO);

let cached: nodemailer.Transporter | null = null;

function transport() {
  if (!cached) {
    cached = nodemailer.createTransport({
      host: HOST,
      port: PORT,
      // 465 is implicit TLS; 587 upgrades with STARTTLS.
      secure: PORT === 465,
      auth: { user: USER, pass: PASS },
    });
  }
  return cached;
}

export interface OrderMail {
  subject: string;
  text: string;
  attachment?: { filename: string; content: Buffer };
}

/**
 * Returns false rather than throwing. The order is already recorded in the
 * sheet by the time this runs, so a mail failure must not fail the request and
 * tell the customer their order did not go through.
 */
export async function sendOrderMail(mail: OrderMail): Promise<boolean> {
  if (!mailConfigured) {
    console.error(
      "[mail] SMTP is not configured — no order email sent. See docs/order-email.md",
    );
    return false;
  }
  try {
    await transport().sendMail({
      from: `"Orders" <${USER}>`,
      to: TO,
      replyTo: USER,
      subject: mail.subject,
      text: mail.text,
      attachments: mail.attachment
        ? [
            {
              filename: mail.attachment.filename,
              content: mail.attachment.content,
              contentType: "application/pdf",
            },
          ]
        : undefined,
    });
    return true;
  } catch (error) {
    console.error("[mail] could not send the order email", error);
    return false;
  }
}
