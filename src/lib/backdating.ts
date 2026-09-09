/**
 * Paper carrying an earlier issue date, and what it costs.
 *
 * The office charges ₹50 for every month between the date the customer wants
 * on the sheet and today, and treats any past date at all as a month — asking
 * for yesterday costs the same ₹50 as asking for a month ago. Part months round
 * up, because the charge is per month of age and there is no half sheet.
 *
 * This is builder-only by deliberate decision. Nothing here is rendered on a
 * public page, indexed, or put in a schema: the office's position is that
 * advertising older-dated paper online is not lawful, and hiding it from the
 * marketing pages while quoting it during drafting is the arrangement they
 * asked for. Keeping the rule in one file rather than inline in a component is
 * what makes that boundary checkable later.
 */

/** Rupees, per month of age, as quoted by the office. */
export const BACKDATE_FEE_PER_MONTH = 50;

/** ISO yyyy-mm-dd for a Date, in local time rather than UTC. */
function isoDay(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/**
 * How many months old the requested date is, for charging.
 *
 * Zero for today or any future date — there is nothing to source. Otherwise the
 * completed calendar months, rounded up whenever a part month is left over, and
 * never less than one. So yesterday is one month, exactly two months ago is
 * two, and two months and a day is three.
 */
export function backdateMonths(wanted: string, today = new Date()): number {
  if (!wanted) return 0;
  const target = new Date(`${wanted}T00:00:00`);
  if (Number.isNaN(target.getTime())) return 0;

  const todayISO = isoDay(today);
  if (wanted >= todayISO) return 0;

  let months =
    (today.getFullYear() - target.getFullYear()) * 12 +
    (today.getMonth() - target.getMonth());
  // A day left over past the whole months is another month on the bill.
  if (today.getDate() > target.getDate()) months += 1;
  return Math.max(1, months);
}

/** What the older date adds to the quote. */
export function backdateFee(wanted: string, today = new Date()): number {
  return backdateMonths(wanted, today) * BACKDATE_FEE_PER_MONTH;
}

/** "3 months older — ₹150" and the like, for the quote line. */
export function backdateLabel(months: number): string {
  return `${months} month${months === 1 ? "" : "s"} older`;
}
