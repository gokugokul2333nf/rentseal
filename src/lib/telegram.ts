/**
 * Telegram notifications for the order desk.
 *
 * Mail is the record; this is the nudge. An operator does not sit watching an
 * inbox, but a phone buzzes, and a lead that is answered in ten minutes is
 * worth more than the same lead answered tomorrow.
 *
 * It is also a second copy. When the Google Sheet was removed, mail became the
 * only place a lead landed, which meant SMTP going down took the whole order
 * form with it. A bot that receives the same lead puts that redundancy back,
 * and the two fail for entirely different reasons.
 *
 * Set up: docs/telegram-notifications.md
 */

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
/** One chat, or several separated by commas — a person and a group, say. */
const CHATS = (process.env.TELEGRAM_CHAT_ID || "")
  .split(",")
  .map((id) => id.trim())
  .filter(Boolean);

export const telegramConfigured = Boolean(TOKEN && CHATS.length);

/** Telegram rejects a message over 4096 characters outright. */
const MAX_TEXT = 4096;

const api = (method: string) => `https://api.telegram.org/bot${TOKEN}/${method}`;

/** Long enough for a PDF upload on a slow line, short enough not to hang. */
const TIMEOUT_MS = 20_000;

export interface TelegramNotice {
  text: string;
  document?: { filename: string; content: Buffer };
}

/**
 * Returns true if at least one chat received it.
 *
 * Never throws. The caller decides what a failure means, and on the orders
 * route it means "the other channel had better have worked", not a 500.
 */
export async function sendTelegramNotice(notice: TelegramNotice): Promise<boolean> {
  if (!telegramConfigured) {
    console.error(
      "[telegram] TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is not set — no notification sent. See docs/telegram-notifications.md",
    );
    return false;
  }

  // Sent whole rather than split across messages: half an order arriving is
  // worse than a trimmed one, and the full record is in the email regardless.
  const text =
    notice.text.length > MAX_TEXT
      ? `${notice.text.slice(0, MAX_TEXT - 40)}\n\n… trimmed — full details in the email.`
      : notice.text;

  const results = await Promise.all(
    CHATS.map(async (chat) => {
      try {
        // No parse_mode on purpose. The order text contains rupee amounts,
        // underscores and dots that MarkdownV2 would reject as unescaped
        // entities, and a notification that fails to send over punctuation is
        // not worth the bold headings.
        const sent = await post(api("sendMessage"), {
          chat_id: chat,
          text,
          disable_web_page_preview: true,
        });
        if (!sent) return false;

        if (notice.document) {
          const form = new FormData();
          form.append("chat_id", chat);
          form.append(
            "document",
            new Blob([new Uint8Array(notice.document.content)], { type: "application/pdf" }),
            notice.document.filename,
          );
          // A failed attachment does not undo a delivered message — the
          // operator still knows a lead came in, and the PDF is in the email.
          await postForm(api("sendDocument"), form);
        }
        return true;
      } catch (error) {
        console.error("[telegram] could not notify", chat, error);
        return false;
      }
    }),
  );

  return results.some(Boolean);
}

async function post(url: string, body: Record<string, unknown>): Promise<boolean> {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!response.ok) {
    console.error("[telegram] rejected", response.status, await response.text());
    return false;
  }
  return true;
}

async function postForm(url: string, form: FormData): Promise<boolean> {
  const response = await fetch(url, {
    method: "POST",
    body: form,
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!response.ok) {
    console.error("[telegram] document rejected", response.status, await response.text());
    return false;
  }
  return true;
}
