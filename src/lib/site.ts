import { DISTRICTS, NOTABLE_TOWNS } from "./districts";
import type { AgreementType, PlanId } from "./types";

/**
 * ⚠️ SUPPLY BEFORE LAUNCH
 *
 * `phone`, `whatsapp`, `email` and `address` below are placeholders. Replace
 * them with the real details — they are the only contact routes on the site and
 * every CTA depends on them.
 *
 * `cin` and `gstin` are intentionally empty. They previously carried invented
 * numbers, which is not something a legal-documents business can publish: a
 * customer, a competitor or a tax officer can check both in seconds. Anything
 * that renders them omits the row entirely while they are blank, so fill them in
 * and they appear — leave them and nothing false is shown.
 */
export const SITE = {
  name: "RentSeal",
  legalName: "RentSeal Legal Technologies Pvt Ltd",
  tagline: "Stamp paper and rental agreements, delivered across Tamil Nadu",
  description:
    "Licensed non-judicial stamp paper and e-Stamp certificates at face value, delivered anywhere in Tamil Nadu — same day in Chennai. Plus rental agreements drafted, stamped and e-signed online.",
  url: "https://rentseal.in",
  phone: "+91 44 4000 1200",
  whatsapp: "+91 90000 12000",
  email: "hello@rentseal.in",
  address: "Prestige Polygon, 471 Anna Salai, Teynampet, Chennai 600018",
  /** Company Identification Number. Empty until the real one is supplied. */
  cin: "",
  /** GST Identification Number. Empty until the real one is supplied. */
  gstin: "",
} as const;

/* ─────────────────────────── Navigation ─────────────────────────── */

export const NAV_LINKS = [
  { label: "Stamp paper", href: "/stamp-paper" },
  {
    label: "Agreements",
    items: [
      { title: "Residential Rental", href: "/services/residential-rental-agreement", desc: "Flats, houses and villas let to families or working professionals." },
      { title: "Commercial Rental", href: "/services/commercial-rental-agreement", desc: "Offices, shops and warehouses with GST and trade-licence clauses." },
      { title: "Lease Deed", href: "/services/lease-agreement", desc: "Long-term leases of 12 months and above, registered at the SRO." },
      { title: "Leave & Licence", href: "/services/leave-and-license", desc: "Licence to occupy without creating a tenancy interest." },
    ],
  },
  { label: "Districts", href: "/rental-agreement" },
  { label: "Delivery", href: "/#delivery" },
  { label: "Pricing", href: "/pricing" },
  { label: "FAQ", href: "/faq" },
] as const;

/** Every conversion path on the site funnels to the lead form. */
export const LEAD_ANCHOR = "/#get-started";

export const FOOTER_LINKS = [
  {
    heading: "Stamp paper",
    links: [
      { label: "₹20 stamp paper", href: "/#stamp-paper" },
      { label: "₹50 stamp paper", href: "/#stamp-paper" },
      { label: "₹100 stamp paper", href: "/#stamp-paper" },
      { label: "₹500 stamp paper", href: "/#stamp-paper" },
      { label: "e-Stamp — any value", href: "/#stamp-paper" },
      { label: "Stamp paper by district", href: "/stamp-paper" },
      { label: "Bulk orders for firms", href: LEAD_ANCHOR },
    ],
  },
  {
    heading: "Agreements",
    links: [
      { label: "Residential Rental Agreement", href: "/services/residential-rental-agreement" },
      { label: "Commercial Rental Agreement", href: "/services/commercial-rental-agreement" },
      { label: "Lease Deed", href: "/services/lease-agreement" },
      { label: "Leave & Licence", href: "/services/leave-and-license" },
      { label: "Rental agreement by district", href: "/rental-agreement" },
      { label: "Talk to us before you order", href: LEAD_ANCHOR },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "How It Works", href: "/how-it-works" },
      { label: "Pricing", href: "/pricing" },
      { label: "Delivery coverage", href: "/#delivery" },
      { label: "Frequently Asked Questions", href: "/faq" },
      { label: "Search the site", href: "/search" },
      { label: "Contact & Support", href: "/contact" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Terms of Service", href: "/legal/terms" },
      { label: "Privacy Policy", href: "/legal/privacy" },
      { label: "Refund Policy", href: "/legal/refund" },
      { label: "Disclaimer", href: "/legal/terms#disclaimer" },
    ],
  },
] as const;

/* ─────────────────────────── Agreement types ─────────────────────────── */

export const AGREEMENT_TYPES: Array<{
  id: AgreementType;
  name: string;
  short: string;
  description: string;
  popular?: boolean;
  bestFor: string[];
  defaultMonths: number;
  slug: string;
}> = [
  {
    id: "residential",
    name: "Residential Rental Agreement",
    short: "Residential",
    description:
      "For flats, independent houses and villas let to families or working professionals. The 11-month agreement most landlords in Tamil Nadu use.",
    popular: true,
    bestFor: ["Flats & apartments", "Independent houses", "Villas", "PG-style single lets"],
    defaultMonths: 11,
    slug: "residential-rental-agreement",
  },
  {
    id: "commercial",
    name: "Commercial Rental Agreement",
    short: "Commercial",
    description:
      "For offices, shops, showrooms and warehouses. Adds trade licence, GST, fit-out and business-use clauses automatically.",
    bestFor: ["Offices & coworking", "Retail shops", "Showrooms", "Warehouses & godowns"],
    defaultMonths: 36,
    slug: "commercial-rental-agreement",
  },
  {
    id: "lease",
    name: "Lease Deed",
    short: "Lease",
    description:
      "For terms of 12 months and above where registration at the Sub-Registrar Office is compulsory. Strongest evidentiary position.",
    bestFor: ["Terms of 1 year or more", "Corporate leases", "Land & industrial plots"],
    defaultMonths: 36,
    slug: "lease-agreement",
  },
  {
    id: "leave-license",
    name: "Leave & Licence Agreement",
    short: "Leave & Licence",
    description:
      "Grants permission to occupy without creating a tenancy interest. Preferred by owners who want a cleaner exit at the end of the term.",
    bestFor: ["Owners wanting easier possession", "Serviced apartments", "Short corporate stays"],
    defaultMonths: 11,
    slug: "leave-and-license",
  },
];

/* ─────────────────────────── Cities ─────────────────────────── */

/**
 * Every location on the site is one of the 38 official districts — see
 * ./districts.ts, which is the source of truth.
 *
 * CITIES is a compatibility view over DISTRICTS in the shape the older
 * components expect (`district`, `agreements`, `sro`, `localities`). New code
 * should import DISTRICTS directly.
 */
export const CITIES = DISTRICTS.map((d) => ({
  ...d,
  district: d.name,
  sro: d.sroTowns.join(", "),
  localities: d.towns,
}));

/** The ten districts we take the most orders from, for compact UI. */
export const FEATURED_DISTRICTS = [
  "chennai",
  "coimbatore",
  "madurai",
  "tiruchirappalli",
  "chengalpattu",
  "salem",
  "tiruvallur",
  "tiruppur",
  "kancheepuram",
  "erode",
].map((slug) => DISTRICTS.find((d) => d.slug === slug)!);

/** Well-known towns that are not districts, shown as "also delivering to". */
export const EXTRA_DISTRICTS = NOTABLE_TOWNS.map((t) => t.town);

/* ─────────────────────────── Pricing ─────────────────────────── */

export const PLANS: Array<{
  id: PlanId;
  name: string;
  price: number;
  tagline: string;
  delivery: string;
  recommended?: boolean;
  features: Array<{ label: string; included: boolean; hint?: string }>;
  cta: string;
}> = [
  {
    id: "basic",
    name: "Basic",
    price: 349,
    tagline: "A clean, compliant draft you print and sign yourself.",
    delivery: "Instant download",
    cta: "Start with Basic",
    features: [
      { label: "Tamil Nadu compliant template", included: true },
      { label: "Dynamic clause generator", included: true },
      { label: "Instant PDF download", included: true },
      { label: "Email delivery", included: true },
      { label: "Cloud storage for 12 months", included: true },
      { label: "e-Stamp paper procured for you", included: false, hint: "You buy the stamp paper yourself" },
      { label: "Aadhaar e-Sign for both parties", included: false },
      { label: "Advocate verification", included: false },
      { label: "WhatsApp delivery", included: false },
      { label: "Doorstep delivery of stamped copy", included: false },
    ],
  },
  {
    id: "standard",
    name: "Standard",
    price: 799,
    tagline: "Everything digital — e-stamped, e-signed, delivered. Nobody visits an office.",
    delivery: "Same day, usually under 4 hours",
    recommended: true,
    cta: "Choose Standard",
    features: [
      { label: "Tamil Nadu compliant template", included: true },
      { label: "Dynamic clause generator", included: true },
      { label: "Instant PDF download", included: true },
      { label: "Email delivery", included: true },
      { label: "Cloud storage, unlimited", included: true },
      { label: "e-Stamp paper procured for you", included: true, hint: "Duty charged at government rate, no markup" },
      { label: "Aadhaar e-Sign for both parties", included: true },
      { label: "Advocate verification", included: false, hint: "Add for ₹700" },
      { label: "WhatsApp delivery", included: true },
      { label: "Doorstep delivery of stamped copy", included: false },
    ],
  },
  {
    id: "premium",
    name: "Premium",
    price: 1499,
    tagline: "An advocate reads every clause before you sign, and a stamped copy reaches your door.",
    delivery: "Verified within 24 hours",
    cta: "Go Premium",
    features: [
      { label: "Tamil Nadu compliant template", included: true },
      { label: "Dynamic clause generator", included: true },
      { label: "Instant PDF download", included: true },
      { label: "Email delivery", included: true },
      { label: "Cloud storage, unlimited", included: true },
      { label: "e-Stamp paper procured for you", included: true },
      { label: "Aadhaar e-Sign for both parties", included: true },
      { label: "Advocate verification", included: true, hint: "Enrolled Bar Council of Tamil Nadu advocate" },
      { label: "WhatsApp delivery", included: true },
      { label: "Doorstep delivery of stamped copy", included: true, hint: "Within Tamil Nadu" },
    ],
  },
];

/* ─────────────────────────── Landing content ─────────────────────────── */

/**
 * Every figure here is a fact about the service or the law, not a claim about
 * volume or reputation. Order counts and star ratings were removed because they
 * were invented, and an unevidenced number is worth less than a true one.
 */
export const STATS = [
  { value: "38", label: "Districts covered", sub: "every one in Tamil Nadu" },
  { value: "1%", label: "Stamp duty rate", sub: "of total rent plus deposit" },
  { value: "11 months", label: "Standard term", sub: "below compulsory registration" },
  // Counter animates the leading number, so keep it one that counts sensibly —
  // "8am – 10pm" rendered as "0am – 10pm" mid-animation.
  { value: "7 days", label: "Support a week", sub: "8am – 10pm, Tamil and English" },
] as const;

export const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Fill in the details",
    body: "Answer plain-English questions about the property, the landlord and the tenant. Every field is explained. Your progress saves as you type.",
    time: "6 minutes",
  },
  {
    step: "02",
    title: "Review your agreement",
    body: "Watch the agreement write itself beside you. Clauses appear and disappear as you change your answers, so nothing is boilerplate you didn't ask for.",
    time: "2 minutes",
  },
  {
    step: "03",
    title: "Pay and e-stamp",
    body: "Pay by UPI, card or net banking. We procure the e-stamp paper at the exact government rate and affix it — no markup, itemised on your invoice.",
    time: "1 minute",
  },
  {
    step: "04",
    title: "Sign and download",
    body: "Both parties e-sign with Aadhaar OTP. The final PDF lands in your email and on WhatsApp, and stays in your dashboard forever.",
    time: "1 minute",
  },
] as const;

export const FEATURES = [
  { icon: "Truck", title: "Delivered to your door", body: "Same day inside Chennai, next working day in the major cities, two to three days everywhere else in Tamil Nadu. Free above ₹2,000 of stamp value." },
  { icon: "Stamp", title: "Every denomination in stock", body: "₹20, ₹50, ₹100, ₹200 and ₹500 non-judicial paper, plus e-Stamp certificates for any value from ₹1 upward." },
  { icon: "ShieldCheck", title: "Licensed and verifiable", body: "Procured through authorised vendors and the state e-Stamp channel. Every sheet carries a certificate number you can check yourself." },
  { icon: "Wand2", title: "Clauses that write themselves", body: "Say the flat is furnished and an inventory clause appears. Allow pets and the pet clause writes itself. No legal drafting required." },
  { icon: "PenTool", title: "Aadhaar e-Sign", body: "Both parties sign with an OTP on their own phone. Legally valid under Section 3A of the Information Technology Act, 2000." },
  { icon: "Scale", title: "Advocate verification", body: "On Premium, an advocate enrolled with the Bar Council of Tamil Nadu reads every clause and signs off before you commit." },
  { icon: "FileText", title: "Smart templates", body: "Four instrument types, version-controlled, each with the schedules and annexures the Sub-Registrar expects." },
  { icon: "Calculator", title: "Honest stamp duty maths", body: "See exactly how the duty is computed — rent × term, plus deposit, at 1%. Every rupee traced to a rule, before you pay." },
  { icon: "MessageCircle", title: "WhatsApp delivery", body: "The signed PDF reaches both parties on WhatsApp the moment it is generated. No hunting through email." },
  { icon: "CloudUpload", title: "Cloud storage forever", body: "Every agreement you have ever made stays in your dashboard, searchable, downloadable, on any device." },
  { icon: "BellRing", title: "Renewal reminders", body: "We nudge you 45 days before expiry and pre-fill the renewal, so a lapsed agreement never costs you a deposit dispute." },
  { icon: "Lock", title: "Identity data stays hidden", body: "Aadhaar and PAN are encrypted at rest, masked everywhere in the interface, and never written to a log." },
  { icon: "Smartphone", title: "Built mobile-first", body: "Two-thirds of our agreements are made on a phone. Every step, including signing, works on a small screen." },
] as const;

export const FAQS = [
  {
    category: "Stamp paper",
    q: "Which stamp paper denominations do you supply?",
    a: "Non-judicial stamp paper in ₹20, ₹50, ₹100, ₹200 and ₹500, which covers almost every ordinary transaction. Where the duty payable is a specific figure — a lease deed, a sale agreement, a mortgage — we issue an e-Stamp certificate for that exact amount instead, from ₹1 upward with no practical ceiling.",
  },
  {
    category: "Stamp paper",
    q: "Do you charge more than the face value printed on the paper?",
    a: "No. You pay exactly the denomination printed on the sheet, plus a flat delivery charge that is stated before you confirm — ₹99 within the Chennai metro and ₹149 elsewhere in Tamil Nadu. Delivery is free on any order above ₹2,000 of stamp value, and free everywhere on ten sheets or more.",
  },
  {
    category: "Stamp paper",
    q: "Which denomination do I need for a rental agreement?",
    a: "In practice most 11-month residential agreements in Tamil Nadu are executed on ₹100 stamp paper. Strictly, duty under Article 35 is 1% of the total rent across the term plus the deposit, and for a 12-month-or-longer agreement that has to be paid in full through an e-Stamp. Tell us the rent, deposit and duration and we will tell you which applies to you before you order.",
  },
  {
    category: "Stamp paper",
    q: "Is the stamp paper you supply genuine?",
    a: "Yes. Everything is procured through licensed stamp vendors and the state's authorised e-Stamping channel. Each sheet or certificate carries a serial or certificate number you can verify yourself against the Registration Department's records — we print it on your invoice so you can check without asking us.",
  },
  {
    category: "Stamp paper",
    q: "Can I buy in bulk for my office or firm?",
    a: "Yes. Ten sheets or more ships free anywhere in Tamil Nadu, we can hold a recurring monthly supply against a standing order, and we raise a single GST invoice to your GSTIN rather than one per delivery. It is built for law firms, builders, HR teams and brokers — ask us about account terms.",
  },
  {
    category: "Delivery",
    q: "Where in Tamil Nadu do you deliver?",
    a: "All 38 districts. Chennai, Chengalpattu, Kancheepuram and Tiruvallur get same-day delivery on orders placed before 2pm. Coimbatore, Madurai, Trichy, Salem, Tiruppur, Erode, Vellore, Hosur, Tirunelveli and Thoothukudi get next working day. Everywhere else in the state is two to three working days.",
  },
  {
    category: "Delivery",
    q: "What if I need it today and I am not in Chennai?",
    a: "Call us before you order. Depending on the district and the time of day we can sometimes arrange same-day through a local partner, and if we cannot we will say so straight away rather than take the order and disappoint you. An e-Stamp certificate, where your instrument allows one, reaches you by email in minutes.",
  },
  {
    category: "Delivery",
    q: "Can I pay on delivery?",
    a: "For orders within the Chennai metro, yes — cash or UPI to the rider. Outside Chennai we ask for payment up front, because the stamp is purchased in your name before it leaves us and cannot be returned to the vendor.",
  },
  {
    category: "Legal validity",
    q: "Is an agreement made on RentSeal legally valid?",
    a: "Yes. Your agreement is drafted on a Tamil Nadu compliant template, e-stamped with duty paid to the Government of Tamil Nadu, and signed using Aadhaar e-Sign, which has the same legal effect as a handwritten signature under Section 3A of the Information Technology Act, 2000. It is admissible in evidence in the same way as a paper agreement.",
  },
  {
    category: "Legal validity",
    q: "Do I need to register an 11-month rental agreement?",
    a: "No. Registration is compulsory only where the term is 12 months or more, under Section 17(1)(d) of the Registration Act, 1908. This is precisely why the 11-month agreement is the norm across Tamil Nadu. An 11-month agreement still needs to be properly stamped to be admissible in evidence — that part is not optional, and it is what we handle for you.",
  },
  {
    category: "Legal validity",
    q: "What happens if my agreement is for 12 months or longer?",
    a: "We flag it the moment you set the term, add the registration clause, compute the registration fee alongside the stamp duty, and book your Sub-Registrar appointment. Both parties still have to appear in person before the Sub-Registrar for a registered instrument — that is a statutory requirement no online service can remove.",
  },
  {
    category: "Stamp duty",
    q: "How is stamp duty calculated in Tamil Nadu?",
    a: "For a lease of less than 30 years, duty is charged at 1% of the total rent payable over the whole term plus any advance or deposit. So for ₹20,000 a month over 11 months with a ₹1,00,000 deposit, the chargeable value is ₹3,20,000 and the duty is ₹3,200. Where registration applies, the registration fee is a further 1%. Our calculator shows this arithmetic line by line before you pay.",
  },
  {
    category: "Stamp duty",
    q: "Do you add a markup on stamp duty?",
    a: "No. Government charges pass through at exactly the rate the Registration Department levies, shown as a separate line on your invoice. We earn only the platform fee, and GST at 18% applies to that fee alone — never to the government portion.",
  },
  {
    category: "Stamp duty",
    q: "Who pays the stamp duty, the landlord or the tenant?",
    a: "By custom in Tamil Nadu the tenant pays, and our default clause reflects that. It is a matter of agreement, not law, so you can change who bears it — or split it equally — in the Agreement Details step, and the clause rewrites itself.",
  },
  {
    category: "Process",
    q: "How long does the whole thing actually take?",
    a: "Filling the form takes most people six to ten minutes. On the Standard plan the e-stamped, e-signed PDF is usually in your inbox within four hours of both parties completing their OTP. On Premium, advocate verification adds up to 24 hours.",
  },
  {
    category: "Process",
    q: "Does the tenant need an account?",
    a: "No. You send them a signing link. They verify their phone with an OTP, review the agreement, and e-sign. They can create an account afterwards if they want their own copy in a dashboard, but nothing forces them to.",
  },
  {
    category: "Process",
    q: "Can I edit the agreement after I have paid?",
    a: "You can edit freely until the e-stamp is affixed. Once the stamp is on the instrument, the document is fixed — that is a legal constraint, not a product one. If something is wrong after stamping, contact support within 48 hours and we will re-issue at cost.",
  },
  {
    category: "Delivery",
    q: "How do I receive the final agreement?",
    a: "Three ways at once: an instant download in your browser, a PDF to the email address of both parties, and a copy on WhatsApp. It also stays in your dashboard permanently, so you can download it years later.",
  },
  {
    category: "Delivery",
    q: "Do I get a physical copy?",
    a: "On the Premium plan we courier a printed, stamped copy anywhere in Tamil Nadu at no extra cost, typically in two to three working days. On other plans you can order one for ₹299.",
  },
  {
    category: "Renewal",
    q: "What happens when my agreement is about to expire?",
    a: "We email and message you 45 days before expiry with a renewal link that pre-fills everything from the previous agreement. You change the rent, apply your escalation, and re-sign. It usually takes under two minutes.",
  },
  {
    category: "Refunds",
    q: "What is your refund policy?",
    a: "Full refund if you cancel before the e-stamp is procured — no questions, no forms. After the e-stamp is procured, the government duty is non-refundable because it has already been paid to the state, but we refund our platform fee in full if the fault is ours. Refunds reach your account in five to seven working days.",
  },
  {
    category: "Support",
    q: "Can I speak to someone in Tamil?",
    a: "Yes. Our support team works in Tamil and English, seven days a week from 8am to 10pm, on phone, WhatsApp and chat. Premium customers get a named advocate they can call directly.",
  },
] as const;

/**
 * Commitments about how the service operates — each one is something we decide
 * and can honour. The previous list claimed ISO 27001 and PCI-DSS certification
 * and registration with the Registration Department, none of which we hold.
 * Stating a certification you do not have is a misrepresentation, and it is the
 * first thing a serious customer checks.
 */
export const TRUST_SIGNALS = [
  "Stamp duty paid in full to the Government of Tamil Nadu",
  "No markup on any government charge",
  "Certificate numbers printed on your invoice to verify yourself",
  "Aadhaar e-Sign under Section 3A, IT Act 2000",
  "Advocates independently enrolled with the Bar Council of Tamil Nadu",
  "Aadhaar and PAN masked in the interface and never logged",
] as const;
