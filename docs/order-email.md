# Order email

Every lead is emailed — an enquiry from the short form and a completed draft
alike. A drafted agreement arrives with the deed attached as a PDF, ready to
print onto stamp paper of the right value, get signed, and courier.

Mail is the whole record. There was a Google Sheet alongside it, written
through an Apps Script webhook; it has been removed. Because the mail is now
the only copy, it carries every field the order has — the parties, the
property, the terms, which sheet to buy and what date to put on it, and each
line of the quote — rather than a summary pointing at a spreadsheet.

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
ORDER_EMAIL=lpscanxerox@gmail.com,gokulgokul077g@gmail.com
```

`ORDER_EMAIL` takes a comma-separated list, so the office and whoever is
watching the pipeline both get every lead without a Gmail forwarding rule that
nobody remembers setting up. Whitespace around the commas is fine.

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

The order **is** lost, so the request fails loudly rather than quietly. A failed
send returns `502 {"ok":false,"error":"unreachable"}`, the form tells the
customer to call or WhatsApp instead, and the reason is logged with a `[mail]`
prefix.

This is the trade for having one record instead of two: nothing can go missing
between them, but SMTP being down means the site cannot take an order. If
`mailConfigured` is false — any of `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS` or a
recipient missing — **every submission fails**. Check the logs for
`SMTP is not configured` after any deploy that touches environment variables.

