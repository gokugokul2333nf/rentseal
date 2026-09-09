import type { PlanId, StampDutyBreakdown } from "./types";
import { NOTARY_FEE } from "./notary";
import { BACKDATE_FEE_PER_MONTH as BACKDATE_PER_MONTH, backdateFee, backdateMonths } from "./backdating";

/**
 * Tamil Nadu stamp duty & registration charges for lease/rental instruments.
 *
 * Basis — Article 35, Indian Stamp Act 1899 as applicable in Tamil Nadu, read with
 * the Registration Act 1908. For a lease of less than 30 years, duty is charged on
 * the aggregate of rent payable over the term plus any advance/deposit paid.
 *
 * Registration is compulsory under s.17(1)(d) of the Registration Act only where the
 * term is 12 months or more; the widely used 11-month agreement is therefore
 * e-stamped and (optionally) notarised, not registered.
 *
 * These are the published slabs. The figure finally debited by the Registration
 * Department at the moment of e-stamping is authoritative — the UI says so.
 */

export const TN_STAMP_RATE_UNDER_30Y = 0.01; // 1% of chargeable value
export const TN_REGISTRATION_RATE = 0.01; // 1% of chargeable value
export const REGISTRATION_MANDATORY_FROM_MONTHS = 12;
export const GST_RATE = 0.18;

export const PLAN_FEES: Record<PlanId, { platform: number; lawyer: number }> = {
  basic: { platform: 349, lawyer: 0 },
  standard: { platform: 799, lawyer: 0 },
  premium: { platform: 1499, lawyer: 700 },
};

export interface StampDutyInput {
  monthlyRent: number;
  securityDeposit: number;
  durationMonths: number;
  plan?: PlanId;
  /** Force registration even for an 11-month term. */
  registerAnyway?: boolean;
  /** Premium includes notary attestation; other plans can add it on. */
  lawyerReview?: boolean;
  /**
   * The instrument cannot be delivered unsworn — an affidavit. The fee is
   * charged whatever the plan and whatever the checkbox says, because there is
   * no version of the document that does without it.
   */
  notaryRequired?: boolean;
  /**
   * The date wanted on the paper, yyyy-mm-dd. A past date is sourced from older
   * stock and charged by the month. Quoted in the builder only.
   */
  stampPaperDate?: string;
}

export function calculateStampDuty({
  monthlyRent,
  securityDeposit,
  durationMonths,
  plan = "standard",
  registerAnyway = false,
  lawyerReview = false,
  notaryRequired = false,
  stampPaperDate = "",
}: StampDutyInput): StampDutyBreakdown {
  const rent = Math.max(0, Number(monthlyRent) || 0);
  const deposit = Math.max(0, Number(securityDeposit) || 0);
  const months = Math.max(1, Number(durationMonths) || 11);

  const totalRentOverTerm = rent * months;
  const chargeableValue = totalRentOverTerm + deposit;

  const registrationRequired =
    months >= REGISTRATION_MANDATORY_FROM_MONTHS || registerAnyway;

  const stampDuty = Math.round(chargeableValue * TN_STAMP_RATE_UNDER_30Y);
  const registrationFee = registrationRequired
    ? Math.round(chargeableValue * TN_REGISTRATION_RATE)
    : 0;

  const fees = PLAN_FEES[plan];
  const platformFee = fees.platform;
  // Premium bundles notary attestation; other plans pay the add-on if they opt
  // in, or if the instrument is one that is void without it.
  const lawyerFee =
    plan === "premium" ? fees.lawyer : lawyerReview || notaryRequired ? NOTARY_FEE : 0;

  const backdatingMonths = backdateMonths(stampPaperDate);
  const backdatingFee = backdateFee(stampPaperDate);

  // GST applies to our service fees only — never to a government levy. Sourcing
  // older-dated stock is our service, so it is inside the GST base.
  const gst = Math.round((platformFee + lawyerFee + backdatingFee) * GST_RATE);

  const total =
    stampDuty + registrationFee + platformFee + lawyerFee + backdatingFee + gst;

  const notes: string[] = [];
  notes.push(
    `Stamp duty is charged at 1% of ₹${chargeableValue.toLocaleString("en-IN")} — the total rent for ${months} month${months === 1 ? "" : "s"} plus the refundable deposit.`,
  );
  if (registrationRequired) {
    notes.push(
      months >= REGISTRATION_MANDATORY_FROM_MONTHS
        ? "Your term is 12 months or longer, so registration at the Sub-Registrar Office is compulsory under Section 17 of the Registration Act, 1908."
        : "You chose to register even though an 11-month agreement does not require it. Registration adds evidentiary weight.",
    );
  } else {
    notes.push(
      "An 11-month term does not require registration. Your agreement is e-stamped and legally valid as evidence.",
    );
  }
  if (notaryRequired) {
    notes.push(
      "Notary attestation is included because an affidavit has to be sworn — it is not an optional extra on this document.",
    );
  }
  if (backdatingMonths > 0) {
    notes.push(
      `The paper is dated ${backdatingMonths} month${backdatingMonths === 1 ? "" : "s"} back, sourced from older stock at ₹${BACKDATE_PER_MONTH} a month. We confirm on the call that the date you asked for is actually available before anything is charged.`,
    );
  }
  notes.push("GST at 18% applies to our service fee only, never to government charges.");

  return {
    totalRentOverTerm,
    refundableDeposit: deposit,
    chargeableValue,
    stampDuty,
    registrationFee,
    registrationRequired,
    platformFee,
    lawyerFee,
    backdatingFee,
    backdatingMonths,
    gst,
    total,
    notes,
  };
}

/** Government portion vs our portion — used to prove we don't mark up state fees. */
export function splitGovernmentAndService(b: StampDutyBreakdown) {
  const government = b.stampDuty + b.registrationFee;
  const service = b.platformFee + b.lawyerFee + b.backdatingFee + b.gst;
  return { government, service, total: government + service };
}
