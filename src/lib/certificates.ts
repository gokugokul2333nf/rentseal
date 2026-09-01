/**
 * Government certificate and registration services, as supplied by the client.
 *
 * Prices and document lists are theirs, transcribed as given. Two things worth
 * knowing before editing:
 *
 *   - `price: null` means no fee was quoted. Anything with a null price renders
 *     "Price on request" rather than a guess — a made-up figure on a price list
 *     is a figure someone will be held to.
 *   - The document lists are what the office actually asks for at the counter.
 *     They are the useful part of this page: a customer who arrives with the
 *     right papers is a job done in one visit instead of three.
 */

export interface CertificateService {
  id: string;
  name: string;
  /** Rupees. Null where the client has not quoted one. */
  price: number | null;
  /** One line on what it is for — ours, to make the list scannable. */
  blurb: string;
  documents: string[];
  category: "Identity" | "Revenue certificate" | "Ration & welfare" | "Business";
  popular?: boolean;
  /** Shown under the document list where something needs explaining. */
  note?: string;
}

export const CERTIFICATE_SERVICES: CertificateService[] = [
  /* ── Identity ─────────────────────────────────────────────────────────── */
  {
    id: "pan-card",
    name: "PAN Card",
    price: 350,
    blurb: "A new Permanent Account Number, needed for tax, banking and any transaction of size.",
    category: "Identity",
    popular: true,
    documents: [
      "Aadhaar card",
      "Two passport-size photographs",
      "School certificate",
      "Signature",
    ],
  },
  {
    id: "new-voter-id",
    name: "New Voter ID",
    price: 350,
    blurb: "First-time enrolment on the electoral roll and a new EPIC card.",
    category: "Identity",
    popular: true,
    documents: ["Aadhaar card", "Phone number", "Passport-size photograph"],
  },
  {
    id: "voter-id-address",
    name: "Voter ID — change of address",
    price: 200,
    blurb: "Moving your entry on the roll to a new address within the state.",
    category: "Identity",
    documents: ["Any address proof", "Aadhaar card", "Phone number"],
  },
  {
    id: "new-passport",
    name: "New Passport",
    price: 3000,
    blurb: "A first passport, from the application through to the appointment.",
    category: "Identity",
    documents: [
      "Aadhaar card",
      "PAN card",
      "Two phone numbers",
      "Email address",
      "10th mark sheet or degree certificate",
      "Birth certificate (for a child applicant)",
    ],
  },
  {
    id: "renewal-passport",
    name: "Passport renewal",
    price: 2500,
    blurb: "Re-issue of an expiring or expired passport.",
    category: "Identity",
    documents: [
      "Old passport",
      "Aadhaar card",
      "PAN card",
      "Two phone numbers",
      "Email address",
      "10th mark sheet or degree certificate",
      "Birth certificate (for a child applicant)",
    ],
  },

  /* ── Revenue certificates ─────────────────────────────────────────────── */
  {
    id: "community-certificate",
    name: "Community Certificate",
    price: 310,
    blurb: "The community entry used for school, college and government applications.",
    category: "Revenue certificate",
    popular: true,
    documents: [
      "Aadhaar card",
      "Photograph",
      "Phone number",
      "Signature",
      "Community certificate of the father or the mother",
      "Birth certificate",
    ],
    note: "The parent's certificate is what the Tahsildar traces the community from, so bring it.",
  },
  {
    id: "income-certificate",
    name: "Income Certificate",
    price: 310,
    blurb: "Annual family income, for scholarships, fee concessions and welfare schemes.",
    category: "Revenue certificate",
    documents: ["Aadhaar card", "Photograph", "Phone number", "Signature", "Ration card"],
  },
  {
    id: "nativity-certificate",
    name: "Nativity Certificate",
    price: 310,
    blurb: "Proof of native place, asked for in state quota admissions and appointments.",
    category: "Revenue certificate",
    documents: [
      "Aadhaar card",
      "Photograph",
      "Phone number",
      "Signature",
      "Birth certificate",
      "School ID card",
    ],
  },
  {
    id: "obc-certificate",
    name: "OBC Certificate",
    price: 310,
    blurb: "Other Backward Class certificate, including the non-creamy-layer income position.",
    category: "Revenue certificate",
    documents: [
      "Aadhaar card",
      "Photograph",
      "Phone number",
      "Signature",
      "Community certificate",
      "Pay slip or income certificate",
      "Ration card",
    ],
  },
  {
    id: "unmarried-certificate",
    name: "Unmarried Certificate",
    price: 310,
    blurb: "A declaration of single status, usually wanted for visa, pension or a second marriage.",
    category: "Revenue certificate",
    documents: [
      "Aadhaar card",
      "Photograph",
      "Phone number",
      "Signature",
      "Marriage invitation",
      "Birth certificate or school transfer certificate",
    ],
  },
  {
    id: "widow-certificate",
    name: "Widow Certificate",
    price: 310,
    blurb: "Required for the widow pension and for most succession and welfare claims.",
    category: "Revenue certificate",
    documents: [
      "Aadhaar card",
      "Joint photograph",
      "Passport-size photograph",
      "Phone number",
      "Signature",
      "Death certificate",
      "Marriage invitation",
      "Ration card",
    ],
  },

  /* ── Ration and welfare ───────────────────────────────────────────────── */
  {
    id: "new-ration-card",
    name: "New Ration Card",
    price: 450,
    blurb: "A fresh family card — the document half the others on this page ask to see.",
    category: "Ration & welfare",
    popular: true,
    documents: [
      "Aadhaar card of every family member",
      "Photograph of the family head",
      "Recent gas bill",
      "Phone number",
    ],
  },
  {
    id: "ration-card-address",
    name: "Ration Card — change of address",
    price: null,
    blurb: "Moving an existing family card to a new address.",
    category: "Ration & welfare",
    documents: ["Gas bill", "Aadhaar card", "Phone number linked to the ration card"],
    note: "The phone number must be the one already linked to the card — the OTP goes there.",
  },

  /* ── Business ─────────────────────────────────────────────────────────── */
  {
    id: "msme",
    name: "MSME / Udyam Registration",
    price: 350,
    blurb: "Udyam registration for a small business — needed for subsidies, tenders and priority lending.",
    category: "Business",
    popular: true,
    documents: [
      "Aadhaar card",
      "PAN card",
      "Phone number",
      "Email address",
      "Bank details",
      "Business name",
      "Business address",
    ],
  },
];

export const CERTIFICATE_CATEGORIES = [
  "Identity",
  "Revenue certificate",
  "Ration & welfare",
  "Business",
] as const;
