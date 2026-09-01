# Order email

Every submission is emailed to the office. A completed agreement arrives with
the deed attached as a PDF, ready to print onto stamp paper of the right value,
get signed, and courier.

**Nothing is sent to the customer.** The finished instrument is the thing being
paid for, and emailing it before the confirming call would give it away — the
same reason printing and copying are switched off in the drafter.

## Setup

Add to `.env.local`, and to the hosting provider's environment for production:

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=lpscanxerox@gmail.com
SMTP_PASS=<16-character app password>
ORDER_EMAIL=lpscanxerox@gmail.com
```

### Gmail needs an App Password, not the account password

1. Turn on 2-Step Verification on the Google account.
2. Go to **Google Account → Security → App passwords**.
3. Create one for "Mail", copy the 16 characters, and put it in `SMTP_PASS`.

Google removed plain-password SMTP, so the account password will be rejected.

`ORDER_EMAIL` is where orders land — set it to a different address if someone
other than the account owner works the order book.

## Limits worth knowing

A free Gmail account sends roughly 500 messages a day. That is comfortable at
current volumes, but it is a hard ceiling and Google does not warn before it
bites. If order volume grows, or if you ever start emailing customers, move to
a transactional provider (Resend, Brevo, SendGrid) — deliverability from Gmail
SMTP to strangers' inboxes is poor.

## What arrives

- **Subject** — `Agreement LP-2026-778899 — Venkatesh M, 9840011111`
- **Body** — name, number, summary, city, estimate and any notes the customer left
- **Attachment** — `LP-2026-778899.pdf`, the full deed

An enquiry (the short "tell us what you need" form) sends the same mail with no
attachment, because there is no drafted agreement yet.

## If mail fails

The order is **not** lost. The Google Sheet is written first and is the durable
record; the email is best-effort on top. A failed send returns
`{"ok":true,"emailed":false}` — the customer still sees success, because their
order genuinely did go through — and logs the reason with a `[mail]` prefix.

Watch for `emailed:false` in the logs: it means the sheet has orders the office
has not been emailed about.

