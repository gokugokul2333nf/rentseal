import type { TemplateSpec } from "./agreement-templates";

/**
 * The questions a template actually needs, worked out from the template.
 *
 * Every verbatim deed carries {{tokens}} where the form's answers go, and no
 * two of them carry the same set: a loan deed names the two parties and the
 * date and nothing else, while a house rent needs the rent, the advance, the
 * term and the property. Asking every customer the same six steps meant asking
 * for "Monthly rent" and "Security deposit" on a loan deed and a no-objection
 * certificate.
 *
 * So the fields are derived from the tokens rather than declared separately.
 * Change the wording of a deed and the questions follow it, with nothing to
 * keep in step by hand.
 */

export type FieldKind =
  | "text"
  | "tamilText"
  | "tamilArea"
  | "aadhaar"
  | "phone"
  | "email"
  | "date"
  | "money"
  | "number"
  | "propertyAddress";

export interface TemplateField {
  /** The token that put this question on the form. */
  token: string;
  kind: FieldKind;
  label: string;
  hint?: string;
  /** Where the answer is stored on the draft. */
  path: string;
  /** "A" or "B" — which side of the deed this belongs to. */
  party?: "A" | "B";
}

/**
 * One entry per token. Tokens that are derived rather than asked — the amount
 * in words, the end date — are deliberately absent: asking twice for the same
 * fact is how the two come to disagree.
 */
const FIELDS: Record<string, Omit<TemplateField, "token">> = {
  nameA: { kind: "tamilText", label: "Full name", path: "landlord.fullName", party: "A" },
  parentA: {
    kind: "tamilText",
    label: "Father's or husband's name",
    hint: "Printed after த/பெ. or க/பெ.",
    path: "landlord.parentName",
    party: "A",
  },
  aadhaarA: { kind: "aadhaar", label: "Aadhaar number", path: "landlord.aadhaar", party: "A" },
  addressA: { kind: "tamilArea", label: "Address", path: "landlord.address", party: "A" },

  nameB: { kind: "tamilText", label: "Full name", path: "tenant.fullName", party: "B" },
  parentB: {
    kind: "tamilText",
    label: "Father's or husband's name",
    path: "tenant.parentName",
    party: "B",
  },
  aadhaarB: { kind: "aadhaar", label: "Aadhaar number", path: "tenant.aadhaar", party: "B" },
  addressB: { kind: "tamilArea", label: "Address", path: "tenant.address", party: "B" },

  // The service provider agreement is between two companies, so it asks for
  // registered names rather than a person's name and father's name.
  companyName: {
    kind: "text",
    label: "Company's registered name",
    path: "landlord.companyName",
    party: "A",
  },
  providerName: {
    kind: "text",
    label: "Service provider's registered name",
    path: "tenant.companyName",
    party: "B",
  },
  executionPlace: { kind: "text", label: "Executed at", path: "terms.executionPlace" },
  executionDate: { kind: "date", label: "Date of the agreement", path: "terms.executionDate" },
  amount: { kind: "money", label: "Franchise fee", path: "terms.securityDeposit" },

  propertyAddress: {
    kind: "propertyAddress",
    label: "The property",
    hint: "Door number, street, locality, town and PIN, as they should read in the deed.",
    path: "property",
  },

  // The deed sets the date out as year, month and day; one question covers all three.
  execYear: { kind: "date", label: "Date of the deed", path: "terms.executionDate" },
  startDate: { kind: "date", label: "Starts on", path: "terms.startDate" },
  rent: { kind: "money", label: "Monthly rent", path: "terms.monthlyRent" },
  deposit: { kind: "money", label: "Advance / deposit", path: "terms.securityDeposit" },
  rentDueDay: {
    kind: "number",
    label: "Rent due on or before",
    hint: "Day of the month",
    path: "terms.rentDueDay",
  },
  noticeMonths: { kind: "number", label: "Notice period", hint: "Months", path: "terms.noticePeriodMonths" },
};

/** Tokens that follow from another answer and are never asked for. */
const DERIVED = new Set([
  "execMonth",
  "execDay",
  "endDate",
  "rentWords",
  "depositWords",
  "blank",
]);

/** The order questions read best in, regardless of where the tokens appear. */
const ORDER = [
  "companyName", "nameA", "parentA", "aadhaarA", "addressA",
  "providerName", "nameB", "parentB", "aadhaarB", "addressB",
  "propertyAddress",
  "execYear", "executionDate", "executionPlace",
  "startDate", "rent", "deposit", "amount", "rentDueDay", "noticeMonths",
];

export function tokensUsedBy(spec: TemplateSpec): Set<string> {
  const found = new Set<string>();
  for (const block of spec.body ?? []) {
    for (const m of block.text.matchAll(/\{\{(\w+)\}\}/g)) found.add(m[1]);
  }
  return found;
}

export function fieldsForTemplate(spec: TemplateSpec): TemplateField[] {
  const used = tokensUsedBy(spec);
  // The date is set out as three tokens; any of them means "ask for the date".
  if (used.has("execMonth") || used.has("execDay")) used.add("execYear");
  // The term is a start and an end; the end is worked out from the duration.
  if (used.has("endDate")) used.add("startDate");

  return ORDER.filter((t) => used.has(t) && !DERIVED.has(t) && FIELDS[t]).map((token) => ({
    token,
    ...FIELDS[token],
  }));
}

/** Whether this deed has a second party at all — an affidavit does not. */
export function hasSecondParty(spec: TemplateSpec): boolean {
  return fieldsForTemplate(spec).some((f) => f.party === "B");
}
