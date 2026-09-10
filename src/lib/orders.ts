import { calculateStampDuty } from "./stamp-duty";
import { isNotaryMandatory } from "./notary";
import { stampPaperDateOf } from "./backdating";
import { propertyAddress, agreementTitle } from "./clauses";
import { AGREEMENT_TYPES } from "./site";
import { TEMPLATES } from "./templates";
import type { AgreementDraft } from "./types";

/**
 * One flat row per submission.
 *
 * The email is the order book now, so everything an operator needs to make the
 * confirming phone call has to survive the trip. It stays flat — no nested
 * objects, no arrays — because orderEmailText below walks it key by key, and a
 * value that stringifies to "[object Object]" is a fact nobody can act on.
 */
export interface OrderRow {
  kind: "enquiry" | "agreement";
  reference: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  city: string;
  /** Which of the twenty-four templates was drawn, e.g. "warehouse-rental". */
  template: string;
  /** Set when the customer reworded or struck clauses. */
  clausesChanged: string;
  /** Rupees, our quote — not a charge. Payment is taken on the call. */
  estimate: string;
  summary: string;
  notes: string;
  [key: string]: string;
}

const joinTruthy = (...parts: Array<string | undefined | null>) =>
  parts.filter((p) => p && String(p).trim()).join(" · ");

/** A drafted agreement, flattened for the order email. */
export function agreementRow(draft: AgreementDraft, notes = ""): OrderRow {
  // An affidavit is sworn or it is nothing, so the counter must not read the
  // notary column as a customer preference it can skip.
  const notaryRequired = isNotaryMandatory(draft.templateId);
  const breakdown = calculateStampDuty({
    monthlyRent: parseFloat(draft.terms.monthlyRent || "0"),
    securityDeposit: parseFloat(draft.terms.securityDeposit || "0"),
    durationMonths: draft.terms.durationMonths,
    plan: draft.plan,
    registerAnyway: draft.options.registrationRequired,
    lawyerReview: draft.options.lawyerReview,
    notaryRequired,
    stampPaperDate: stampPaperDateOf(draft),
    templateId: draft.templateId,
    stampPaperValue: draft.options.stampPaperValue,
    documentPages: draft.options.documentPages,
    extraPrintedCopies: draft.options.extraPrintedCopies,
    softCopy: draft.options.softCopy,
  });
  const meta = AGREEMENT_TYPES.find((t) => t.id === draft.type);
  // Which of the twenty-four was drawn. "Commercial Rental Agreement" does not
  // tell the counter whether to print a warehouse deed or an ATM lobby licence.
  const tpl = TEMPLATES.find((t) => t.id === draft.templateId);
  const reworded = Object.keys(draft.options.clauseEdits ?? {}).length;
  const struck = (draft.options.removedClauseIds ?? []).length;

  // Whoever we call is the landlord where we have their number, the tenant
  // otherwise — one of the two has always been filled in by this point.
  const primary = draft.landlord.phone ? draft.landlord : draft.tenant;

  return {
    kind: "agreement",
    reference: draft.id,
    contactName: primary.fullName || draft.landlord.fullName || draft.tenant.fullName,
    contactPhone: primary.phone,
    contactEmail: primary.email,
    city: draft.property.city || draft.property.district,
    estimate: String(breakdown.total),
    summary: joinTruthy(
      tpl?.name ?? meta?.name ?? agreementTitle(draft),
      `${draft.terms.durationMonths} months`,
      draft.terms.monthlyRent ? `rent ${draft.terms.monthlyRent}` : "",
      draft.terms.securityDeposit ? `deposit ${draft.terms.securityDeposit}` : "",
      `${draft.plan} plan`,
    ),
    notes,

    agreementType: tpl?.name ?? meta?.name ?? draft.type,
    template: draft.templateId,
    // Loud on purpose: a deed with reworded clauses must not be printed from
    // the standard template. The attached PDF is the one to use.
    clausesChanged: reworded || struck
      ? `${reworded} reworded, ${struck} struck — print the attached PDF, not the standard template`
      : "",
    plan: draft.plan,
    monthlyRent: draft.terms.monthlyRent,
    securityDeposit: draft.terms.securityDeposit,
    durationMonths: String(draft.terms.durationMonths),
    executionDate: draft.terms.executionDate,
    executionPlace: draft.terms.executionPlace,
    startDate: draft.terms.startDate,
    depositAlreadyPaid: draft.terms.depositAlreadyPaid ? "yes" : "no",
    propertyKind: draft.property.kind,
    // Plain address for the rider; the portion separately, because whether the
    // whole house or one floor is let changes what gets drafted.
    propertyAddress: propertyAddress(draft),
    portion: draft.property.wholeProperty ? "whole property" : draft.property.portionDescription,
    pincode: draft.property.pincode,
    district: draft.property.district,
    landlordName: draft.landlord.fullName,
    landlordPhone: draft.landlord.phone,
    landlordEmail: draft.landlord.email,
    tenantName: draft.tenant.fullName,
    tenantPhone: draft.tenant.phone,
    tenantEmail: draft.tenant.email,
    stampDuty: String(breakdown.stampDuty),
    registrationFee: String(breakdown.registrationFee),
    documentFee: String(breakdown.documentFee),
    stampPaperValue: String(draft.options.stampPaperValue),
    stampPaperFee: String(breakdown.stampPaperFee),
    documentPages: String(draft.options.documentPages),
    // platformFee includes the document's own price; the email lists that
    // separately, so this is the plan's uplift on top of it and nothing else.
    planFee: String(breakdown.platformFee - breakdown.documentFee),
    gst: String(breakdown.gst),
    registrationRequired: draft.options.registrationRequired ? "yes" : "no",
    notaryFee: String(breakdown.lawyerFee),
    // The counter has to source this sheet, so it needs the date and the months
    // spelt out rather than inferred from the fee.
    stampPaperDate: stampPaperDateOf(draft),
    backdatingMonths: breakdown.backdatingMonths ? String(breakdown.backdatingMonths) : "",
    backdatingFee: String(breakdown.backdatingFee),
    // The counter prints and stamps these, so it needs the count, not just a fee.
    extraPrintedCopies: String(draft.options.extraPrintedCopies || ""),
    printedCopiesFee: String(breakdown.printedCopiesFee),
    softCopy: draft.options.softCopy ? "yes" : "no",
    softCopyFee: String(breakdown.softCopyFee),
    lawyerReview: notaryRequired
      ? "yes — required (affidavit)"
      : draft.options.lawyerReview
        ? "yes"
        : "no",
  };
}

/** The short "tell us what you need" form, flattened the same way. */
export function enquiryRow(fields: {
  need: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  denomination?: string;
  /** Which attestation, if any, the counter should quote for. */
  notary?: string;
  /** The date the customer wants the paper for. Blank if they did not say. */
  stampDate?: string;
  agreementType?: string;
  message?: string;
}): OrderRow {
  return {
    kind: "enquiry",
    reference: "",
    contactName: fields.name,
    contactPhone: fields.phone,
    contactEmail: fields.email,
    city: fields.city,
    estimate: "",
    summary: joinTruthy(
      fields.need,
      fields.denomination ? `denomination ${fields.denomination}` : "",
      fields.notary && fields.notary !== "none" ? `notary ${fields.notary}` : "",
      fields.stampDate ? `dated ${fields.stampDate}` : "",
      fields.agreementType ?? "",
    ),
    notes: fields.message ?? "",
    // An enquiry has no drafted deed behind it. The keys still line up across
    // both kinds of row so one renderer can read either.
    template: "",
    clausesChanged: "",
    need: fields.need,
    denomination: fields.denomination ?? "",
    notary: fields.notary ?? "",
    stampDate: fields.stampDate ?? "",
    agreementType: fields.agreementType ?? "",
  };
}


/* ═══════════════════════ The order email ═══════════════════════ */

/**
 * The row, written out for a person to read.
 *
 * This used to be six lines — name, phone, summary, city, estimate, notes —
 * because the forty-odd other fields were going to a spreadsheet and the mail
 * was only a nudge to go and look at it. With the sheet gone the mail is the
 * whole record, so everything the row carries has to be in it or it is lost:
 * who the parties are, what the property is, every fee that makes up the
 * quote, which sheet to buy and what date to put on it.
 *
 * Empty fields are dropped rather than printed blank. An operator scanning for
 * the deposit should not have to read past eleven "—" lines to find it.
 */
const LABELS: Record<string, string> = {
  contactName: "Name",
  contactPhone: "Phone",
  contactEmail: "Email",
  city: "City",
  need: "Wants",
  denomination: "Denomination",
  notary: "Notary",
  stampDate: "Date wanted",
  agreementType: "Document",
  template: "Template",
  plan: "Plan",
  clausesChanged: "Clauses",
  monthlyRent: "Monthly rent",
  securityDeposit: "Deposit",
  depositAlreadyPaid: "Deposit already paid",
  durationMonths: "Term (months)",
  startDate: "Starts",
  executionDate: "Signed on",
  executionPlace: "Signed at",
  propertyKind: "Property type",
  propertyAddress: "Address",
  portion: "Portion let",
  pincode: "PIN",
  district: "District",
  landlordName: "Landlord",
  landlordPhone: "Landlord phone",
  landlordEmail: "Landlord email",
  tenantName: "Tenant",
  tenantPhone: "Tenant phone",
  tenantEmail: "Tenant email",
  stampPaperValue: "Stamp paper (face value)",
  stampPaperFee: "Stamp paper charge",
  stampPaperDate: "Date on the paper",
  backdatingMonths: "Back-dated (months)",
  backdatingFee: "Back-dating charge",
  documentPages: "Sheets",
  extraPrintedCopies: "Extra printed copies",
  printedCopiesFee: "Printed copies charge",
  softCopy: "Soft copy",
  softCopyFee: "Soft copy charge",
  documentFee: "Drafting fee",
  planFee: "Plan service fee",
  stampDuty: "Stamp duty",
  registrationFee: "Registration fee",
  registrationRequired: "Registration required",
  notaryFee: "Notary fee",
  lawyerReview: "Notary attestation",
  gst: "GST",
  estimate: "ESTIMATE",
};

const GROUPS: Array<{ title: string; keys: string[] }> = [
  { title: "Who to call", keys: ["contactName", "contactPhone", "contactEmail", "city"] },
  { title: "What they want", keys: ["need", "denomination", "notary", "stampDate", "agreementType", "template", "plan", "clausesChanged"] },
  { title: "Terms", keys: ["monthlyRent", "securityDeposit", "depositAlreadyPaid", "durationMonths", "startDate", "executionDate", "executionPlace"] },
  { title: "Property", keys: ["propertyKind", "propertyAddress", "portion", "pincode", "district"] },
  { title: "Parties", keys: ["landlordName", "landlordPhone", "landlordEmail", "tenantName", "tenantPhone", "tenantEmail"] },
  // Facts here, money below. A section headed "the quote" whose lines do not
  // add up to the estimate printed under them is a section an operator has to
  // check with a calculator, so every rupee lives in one list and that list
  // sums to the total.
  { title: "Paper and copies", keys: ["stampPaperValue", "stampPaperDate", "backdatingMonths", "documentPages", "extraPrintedCopies", "softCopy", "registrationRequired", "lawyerReview"] },
  { title: "The quote", keys: ["documentFee", "planFee", "stampPaperFee", "stampDuty", "registrationFee", "notaryFee", "backdatingFee", "printedCopiesFee", "softCopyFee", "gst", "estimate"] },
];

/** Values that mean "nothing to say" rather than a fact worth printing. */
const EMPTY = new Set(["", "0", "no", "none"]);

export function orderEmailText(row: OrderRow): string {
  const isAgreement = row.kind === "agreement";
  const out: string[] = [];

  out.push(row.summary || (isAgreement ? "Drafted agreement" : "Enquiry"));
  if (row.reference) out.push(`Reference ${row.reference}`);
  out.push("");

  for (const group of GROUPS) {
    const lines = group.keys
      .filter((k) => {
        const v = String(row[k] ?? "").trim();
        // The estimate is worth printing even at zero; a zero deposit is not.
        return v && (!EMPTY.has(v.toLowerCase()) || k === "estimate");
      })
      .map((k) => `  ${LABELS[k].padEnd(24)} ${row[k]}`);
    if (!lines.length) continue;
    out.push(group.title.toUpperCase(), ...lines, "");
  }

  if (row.notes) out.push("NOTES", `  ${row.notes}`, "");

  out.push(
    isAgreement
      ? "The drafted agreement is attached. Print it on stamp paper of the value above, get it signed, and courier it."
      : "This is an enquiry, not a drafted agreement. Call to find out what they need.",
    "",
    `Submitted ${new Date().toLocaleString("en-IN")}.`,
  );

  return out.join("\n");
}
