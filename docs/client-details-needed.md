# What we need from the client before launch

Everything on the site runs today on placeholder values. They read as real, so
nothing looks broken in a demo — which is exactly why this list exists. Each
item below names the file and field it maps to.

Two are blank rather than invented, because a legal-documents business cannot
publish a made-up registration number: `cin` and `gstin`. Anything blank is
simply not rendered, so nothing false is on the site while we wait.

## 1. Contact — blocks launch

`src/lib/site.ts` → `SITE`

| Field | Placeholder now | Notes |
|---|---|---|
| `phone` | +91 44 4000 1200 | The number in the header, footer and every "prefer to call" |
| `whatsapp` | +91 90000 12000 | The number behind every WhatsApp button |
| `email` | hello@rentseal.in | Needs a working mailbox, not an alias nobody reads |
| `address` | Prestige Polygon, 471 Anna Salai, Teynampet, Chennai 600018 | Full registered address with PIN |
| `hours` | 08:00–22:00, seven days | Real support hours — also drives the Google opening-hours schema |

Payment is taken on the confirming call, so a wrong number here means an order
that gets drafted and then lost.

## 2. Legal identity — blocks launch

`src/lib/site.ts` → `SITE`

| Field | Notes |
|---|---|
| `legalName` | Exact registered name, spelling and suffix as on the certificate of incorporation |
| `cin` | Company Identification Number — currently blank, so the row is hidden |
| `gstin` | 15-character GSTIN — currently blank, so the row is hidden |
| `url` | Final domain, with or without `www`, whichever will be canonical |

The Terms, Privacy and Refund pages name the company as the contracting party.
They should be read by whoever is accountable for them before launch.

## 3. Prices

`src/lib/site.ts` → `PLANS`, and `src/lib/stamp-paper.ts` → `DELIVERY_RULES`

| Field | Placeholder now |
|---|---|
| Basic / Standard / Premium plan price | ₹349 / ₹799 / ₹1,499 + GST |
| What each plan includes | Currently our own guesses — confirm line by line |
| Delivery charge, Chennai metro | ₹99 |
| Delivery charge, rest of Tamil Nadu | ₹149 |
| Free delivery above | ₹2,000 of stamp value |
| Free delivery from | 10 sheets |
| Advocate review add-on | ₹700 on non-Premium plans |
| Printed stamped copy add-on | ₹299 |

Stamp duty (1% of rent over the term plus deposit) and the registration fee are
statutory, not the client's to set.

## 4. Delivery promises

`src/lib/stamp-paper.ts` → `ZONES`

We currently promise same day inside the Chennai metro for orders before 2pm,
next working day in the major cities, and two to three working days elsewhere.
These are on the site as commitments, so they need to be ones the operation can
actually keep. The 2pm cut-off in particular.

## 5. The order sheet — blocks launch

The site takes no payment. Every enquiry and every drafted agreement is posted
to a Google Sheet that the team works from.

- Who owns the sheet, and who gets notified when a row lands
- Deployment URL for `SHEETS_WEBHOOK_URL` (see `docs/google-sheet-webhook.md`)
- Who makes the confirming call, and within what time — the site currently
  promises 30 minutes during working hours
- How payment is collected on that call: UPI, bank transfer, or cash on delivery

## 6. Social profiles — optional

`src/lib/site.ts` → `SITE.social`

X, LinkedIn, Instagram and YouTube. Each is blank, and a blank one hides its
icon — better a missing icon than one that opens twitter.com's front page.
Send only the profiles that actually exist.

## 7. Claims we should check

These are on the site now and are the client's to confirm or strike:

- "Advocates independently enrolled with the Bar Council of Tamil Nadu" —
  is there a panel, and are they engaged?
- "Aadhaar e-Sign under Section 3A of the IT Act, 2000" — is the e-Sign ASP
  contracted?
- "Procured through licensed stamp vendors and the state's authorised
  e-Stamping channel" — is the vendor relationship in place?
- "Support in Tamil and English" — is Tamil support actually staffed?
- Refund terms on the Refund Policy page

Anything that cannot be backed should come off rather than be softened.
