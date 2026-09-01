import { calculateStampDuty } from "./stamp-duty";
import { propertyAddress, agreementTitle } from "./clauses";
import { AGREEMENT_TYPES } from "./site";
import type { AgreementDraft } from "./types";

/**
 * One flat row per submission.
 *
 * The sheet is the order book, so everything an operator needs to make the
 * confirming phone call has to survive the trip — no nested objects, no arrays,
 * nothing that reads as "[object Object]" in a spreadsheet cell.
 */
export interface SheetRow {
  kind: "enquiry" | "agreement";
  reference: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  city: string;
  /** Rupees, our quote — not a charge. Payment is taken on the call. */
  estimate: string;
  summary: string;
  notes: string;
  [key: string]: string;
}

const joinTruthy = (...parts: Array<string | undefined | null>) =>
  parts.filter((p) => p && String(p).trim()).join(" · ");

/** A drafted agreement, flattened for the order sheet. */
export function agreementRow(draft: AgreementDraft, notes = ""): SheetRow {
  const breakdown = calculateStampDuty({
    monthlyRent: parseFloat(draft.terms.monthlyRent || "0"),
    securityDeposit: parseFloat(draft.terms.securityDeposit || "0"),
    durationMonths: draft.terms.durationMonths,
    plan: draft.plan,
    registerAnyway: draft.options.registrationRequired,
    lawyerReview: draft.options.lawyerReview,
  });
  const meta = AGREEMENT_TYPES.find((t) => t.id === draft.type);

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
      meta?.name ?? agreementTitle(draft.type),
      `${draft.terms.durationMonths} months`,
      draft.terms.monthlyRent ? `rent ${draft.terms.monthlyRent}` : "",
      draft.terms.securityDeposit ? `deposit ${draft.terms.securityDeposit}` : "",
      `${draft.plan} plan`,
    ),
    notes,

    agreementType: meta?.name ?? draft.type,
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
    platformFee: String(breakdown.platformFee),
    gst: String(breakdown.gst),
    registrationRequired: draft.options.registrationRequired ? "yes" : "no",
    lawyerReview: draft.options.lawyerReview ? "yes" : "no",
  };
}

/** The short "tell us what you need" form, flattened for the same sheet. */
export function enquiryRow(fields: {
  need: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  denomination?: string;
  agreementType?: string;
  message?: string;
}): SheetRow {
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
      fields.agreementType ?? "",
    ),
    notes: fields.message ?? "",
    need: fields.need,
    denomination: fields.denomination ?? "",
    agreementType: fields.agreementType ?? "",
  };
}
