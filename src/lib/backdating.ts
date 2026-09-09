import type { AgreementDraft } from "./types";
import { TEMPLATE_SPECS } from "./agreement-templates";
import { collectsExecutionDate } from "./template-fields";

/**
 * Paper carrying an earlier issue date, and what it costs.
 *
 * The office charges ₹50 for each calendar month the customer goes back. A date
 * in the current month — including yesterday and the first of the month — is
 * charged as usual, with nothing added. Last month is ₹50, the month before
 * ₹100, and so on.
 *
 * This is builder-only by deliberate decision. Nothing here is rendered on a
 * public page, indexed, or put in a schema: the office's position is that
 * advertising older-dated paper online is not lawful, and hiding it from the
 * marketing pages while quoting it during drafting is the arrangement they
 * asked for. Keeping the rule in one file rather than inline in a component is
 * what makes that boundary checkable later.
 */

/**
 * The date the sheet should carry, for a given draft.
 *
 * Most deeds are asked their date up front — every letting is, and any verbatim
 * deed whose wording carries the date tokens. For those the stamp paper simply
 * takes the date already given, because the date printed on the sheet and the
 * date inside the deed are the same date and asking twice invites them to
 * differ. Only a deed that was never asked gets its own field on the review
 * step.
 */
export function stampPaperDateOf(draft: AgreementDraft): string {
  const spec = TEMPLATE_SPECS[draft.templateId];
  return spec && collectsExecutionDate(spec)
    ? draft.terms.executionDate
    : draft.options.stampPaperDate;
}

/** Rupees, per month of age, as quoted by the office. */
export const BACKDATE_FEE_PER_MONTH = 50;

/**
 * How many calendar months back the requested date is, for charging.
 *
 * The month is the unit, not the day. Anything inside the current month — today,
 * yesterday, the first of the month, or a date still to come — is zero, and the
 * fee is the usual one. Step into last month and it is one, the month before
 * that is two, and so on.
 *
 * This replaces an earlier reading in which any past date at all counted as a
 * month, so yesterday cost ₹50. The office has since been explicit that the
 * current month is charged as usual, which is the rule here.
 */
export function backdateMonths(wanted: string, today = new Date()): number {
  if (!wanted) return 0;
  const target = new Date(`${wanted}T00:00:00`);
  if (Number.isNaN(target.getTime())) return 0;

  const months =
    (today.getFullYear() - target.getFullYear()) * 12 +
    (today.getMonth() - target.getMonth());
  return Math.max(0, months);
}

/** What the older date adds to the quote. */
export function backdateFee(wanted: string, today = new Date()): number {
  return backdateMonths(wanted, today) * BACKDATE_FEE_PER_MONTH;
}

/** "3 months back — ₹150" and the like, for the quote line. */
export function backdateLabel(months: number): string {
  return `${months} month${months === 1 ? "" : "s"} back`;
}
