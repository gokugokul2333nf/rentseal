# RentSeal

Landing site for a Tamil Nadu stamp paper supply and delivery business, which
also drafts rental agreements. Next.js 16 (App Router) · React 19 · TypeScript ·
Tailwind v4 · Framer Motion.

```bash
npm run dev     # http://localhost:3000
npm run build   # production build
npm run lint    # eslint
```

---

## What the business sells

1. **Stamp paper** — licensed non-judicial paper in ₹20 / ₹50 / ₹100 / ₹200 /
   ₹500, plus e-Stamp certificates for any value. Sold at face value with a flat
   delivery charge.
2. **Delivery across all 38 districts** — same day in the Chennai metro (order
   before 2pm), next working day in the major cities, 2–3 days elsewhere. Free
   above ₹2,000 of stamp value or on 10+ sheets.
3. **Rental agreements** — drafted, stamped and e-signed, as a second line.

Catalogue, delivery zones, charges and use-cases all live in
`src/lib/stamp-paper.ts` — edit that one file to change denominations, ETAs or
delivery pricing anywhere on the site.

## Current scope: landing page + lead capture

The site runs as a **marketing landing site**. Every call to action funnels to
the lead form at `/#get-started`, which asks what the customer needs (stamp
paper / agreement / both) and swaps its fields accordingly — denomination and
delivery city for stamp paper, agreement type and property city otherwise.

The full self-serve product (agreement builder, stamp duty calculator, accounts)
is **built but switched off** — see [Re-enabling the product](#re-enabling-the-product).

### Live routes

| Route | What it is |
| --- | --- |
| `/` | Landing page — hero, stats, **stamp paper catalogue** (`#stamp-paper`), **delivery coverage** (`#delivery`), **lead form** (`#get-started`), agreement types, how it works, features, comparison, pricing, testimonials, FAQ |
| `/how-it-works` | Long-form process explanation + `HowTo` schema |
| `/pricing` | Three plans, old-way comparison, full FAQ |
| `/faq` | 14 questions grouped by category + `FAQPage` schema |
| `/about` | Story, values, timeline, company facts |
| `/contact` | Contact form, phone/WhatsApp/email, hours |
| `/services/[slug]` | 4 SEO pages — residential, commercial, lease deed, leave & licence |
| `/rental-agreement` | District index — all 38, grouped by region, `ItemList` schema |
| `/rental-agreement/[district]` | **38** district pages with `LocalBusiness` schema |
| `/stamp-paper` | District index — all 38, grouped by region, `ItemList` schema |
| `/stamp-paper/[district]` | **38** district pages with `LocalBusiness` schema |
| `/legal/{terms,privacy,refund}` | Policy pages with a sticky table of contents |
| `/sitemap.xml`, `/robots.txt` | Generated from `src/lib/site.ts` and `src/lib/services.ts` |

---

## The location matrix

Every location page on the site is one of the **38 official districts of Tamil
Nadu**, and they all come out of `src/lib/districts.ts` — the single source of
truth. Two page families are generated from that one list:

```
/rental-agreement/[district]   38 pages   agreement drafting, stamping, e-signing
/stamp-paper/[district]        38 pages   paper and e-Stamp supply + delivery
```

Plus an index for each (`/rental-agreement`, `/stamp-paper`) that groups all 38
by region, so no district page is more than two clicks from the homepage and
none of them is orphaned.

### Adding or changing a district

Edit the one entry in `src/lib/districts.ts`. Both page families, both indexes,
the footer strips, the sitemap and the lead-form dropdown pick it up
automatically — there is no second list to keep in sync.

Each district carries the fields that keep its two pages from reading like every
other district's:

| Field | Used for |
| --- | --- |
| `hq`, `region` | Eyebrow, grouping on the index pages |
| `zone` | Delivery ETA and charge — ties to `DELIVERY_ZONES` in `stamp-paper.ts` |
| `sroTowns` | The Sub-Registrar Office chips, one per taluk headquarters |
| `towns` | "Where our orders come from", and long-tail keywords |
| `orders` | Stat card, and sitemap priority (1,000+ orders ⇒ 0.8, else 0.6) |
| `economy`, `demand` | Two paragraphs of prose unique to that district |

`economy` and `demand` are the important ones. Without them 76 pages would be
the same template with a name swapped in, which is exactly the thin-content
pattern Google demotes. Write them for any district you add.

### Slug stability

Slugs are the official district names. Two of the original city slugs were towns
rather than districts (`trichy`, `hosur`), so `next.config.ts` holds permanent
redirects mapping them — and six other common town spellings — onto their parent
district. **Never rename a slug without adding a redirect there.**

---

## Where things live

```
src/
  app/
    (site)/          public pages — wrapped in Header + Footer + MobileCta
    _disabled/       built but not routed (Next.js private folder)
    layout.tsx       fonts, metadata, Organization + WebSite JSON-LD
    sitemap.ts       lists live routes only
  components/
    landing/         hero, lead-form, features, pricing, testimonials, faq…
    site/            header, footer, page-hero, mobile-cta, contact-form, legal-page
    builder/         multi-step agreement builder  (currently unrouted)
    tools/           stamp duty calculator          (currently unrouted)
    ui/              button, card, field, accordion, motion, logo
  lib/
    site.ts          nav, footer, plans, cities, FAQs, testimonials, LEAD_ANCHOR
    services.ts      long-form content for the 4 service pages
    clauses.ts       dynamic clause generator (20 rules, 8 conditional)
    stamp-duty.ts    Tamil Nadu duty + registration fee engine
    agreement-store.tsx  builder state with debounced autosave
```

### Design tokens

All in `src/app/globals.css` under `@theme`. Navy `#0F172A`, royal blue
`#2563EB`, emerald `#10B981`, canvas `#F8FAFC`, borders `#E2E8F0`. Headings are
Plus Jakarta Sans, body is Inter, both via `next/font`. Reduced-motion and print
styles are handled globally at the bottom of that file.

### Editing content

Most copy is data, not JSX:

- **Denominations, delivery zones, charges** → `src/lib/stamp-paper.ts`
- **Agreement plans and prices** → `PLANS` in `src/lib/site.ts`
- **Cities** → `CITIES` and `EXTRA_DISTRICTS` in `src/lib/site.ts`
- **FAQs** → `FAQS` in `src/lib/site.ts` (the `category` field drives grouping on `/faq`)
- **Testimonials, stats, features** → same file
- **Service pages** → `SERVICES` in `src/lib/services.ts`
- **Phone, WhatsApp, address, GSTIN** → `SITE` in `src/lib/site.ts`

---

## Wiring up the lead form

`src/components/landing/lead-form.tsx` currently simulates the submit with a
timeout. To send it somewhere real, replace the body of `submit()` with a POST.
The fields are already named:

| Field | Always present | Notes |
| --- | --- | --- |
| `need` | yes | `stamp-paper` · `agreement` · `both` |
| `name`, `phone` | yes | phone is validated to 10 digits |
| `email`, `message` | yes | optional |
| `city` | yes | delivery address city, or property city |
| `denomination` | only when `need=stamp-paper` | `20`…`500`, `custom`, `not-sure` |
| `agreementType` | otherwise | `residential`…`leave-license`, `not-sure` |

The same applies to `src/components/site/contact-form.tsx`.

---

## Re-enabling the product

Everything under `src/app/_disabled/` is complete and type-checked; the leading
underscore is the Next.js convention for a folder excluded from routing. To turn
a feature back on, move it into a routed group:

```bash
cd src/app
mv _disabled/create "(site)/create"                       # agreement type chooser
mv "_disabled/(builder)" "(builder)"                      # 7-step builder
mv _disabled/success "(site)/success"                     # post-payment + confetti
mv _disabled/stamp-duty-calculator "(site)/stamp-duty-calculator"
mv _disabled/login login                                  # OTP sign-in
```

Then point the CTAs back at them. Every conversion link uses the `LEAD_ANCHOR`
constant in `src/lib/site.ts`, so changing that one value redirects the whole
site. Also re-add the `Tools` group to `NAV_LINKS`, the calculator entry to
`FOOTER_LINKS`, and both to `sitemap.ts`.

Note: `_disabled/login` routes to `/dashboard`, which has not been built yet.

### What the builder does

- 7 steps — property, landlord, tenant, terms, clauses, review, payment
- Debounced autosave to `localStorage`, restored on return
- **Dynamic clause generator** — 20 clauses, 8 conditional on your answers
  (furnished → inventory clause + Schedule B, pets, parking, lock-in, commercial
  use, maintenance split, registration once the term reaches 12 months)
- Live document preview beside the form, updating as you type, with unfilled
  fields shown as shaded blanks
- Running cost panel: stamp duty at 1% of (rent × term + deposit), registration
  fee where applicable, platform fee, and GST on our fee only
- Print stylesheet renders the agreement as A4 with proper page breaks
