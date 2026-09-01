# The order sheet

Nothing is charged on the site. Every submission — the short "tell us what you
need" enquiry and a fully drafted agreement alike — is posted to
`/api/orders`, which forwards it to a Google Sheet. An operator reads the row,
calls to confirm, takes payment on that call, and then it ships.

## One-time setup

1. Make a Google Sheet. Name the first tab **Orders**.

2. **Extensions → Apps Script**, delete the placeholder, paste `webhook.gs`
   from this folder, and save.

3. **Deploy → New deployment → Web app**
   - *Execute as*: **Me**
   - *Who has access*: **Anyone**

   "Anyone" is what lets our server post to it without a Google login. The URL
   is the only credential, which is why it is held server-side and never
   shipped to the browser.

4. Copy the deployment URL — it looks like
   `https://script.google.com/macros/s/AKfy…/exec` — and put it in
   `.env.local`:

   ```
   SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/AKfy…/exec
   ```

5. Restart `next dev`. Set the same variable in your hosting provider's
   environment for production.

## Checking it works

```bash
curl -X POST http://localhost:3011/api/orders \
  -H 'Content-Type: application/json' \
  -d '{"kind":"enquiry","contactName":"Test","contactPhone":"9840000000","summary":"smoke test"}'
```

`{"ok":true}` means the row is in the sheet. `{"ok":false,"error":"not-configured"}`
means the environment variable has not been picked up.

## Columns

The script writes the header row itself on first use and adds a new column
whenever a submission carries a field it has not seen before, so existing rows
and any formulas or filters you have built stay where they are.

Every row carries `kind` (`enquiry` or `agreement`), `submittedAt`,
`contactName`, `contactPhone`, `contactEmail`, `city`, `summary`, `notes` and
`estimate`. Agreements add the full draft: both parties, the property address,
rent, deposit, term, plan and the duty breakdown.

`estimate` is our quote, not a payment. Nothing has been collected at the point
a row appears.

## If a submission fails

The form says so and offers the phone number and WhatsApp instead — it never
reports a false success, because an order that silently failed to reach the
sheet is an order nobody will ever call about. Server-side failures are logged
with an `[orders]` prefix.
