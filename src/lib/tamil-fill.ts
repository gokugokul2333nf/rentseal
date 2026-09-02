import type { AgreementDraft } from "./types";
import { TAMIL_TEMPLATES, type TamilBlock, type TamilTemplateId } from "./tamil-templates";
import { tamilDateParts, tamilNumberWords } from "./tamil-words";
import { addMonths, formatDateNumeric } from "./utils";

/**
 * Filling a Tamil deed from the builder's answers.
 *
 * Only the blanks whose meaning the surrounding Tamil settles carry a token;
 * the rest stay as underscores and are written in at the counter, or edited in
 * the builder before the deed is sent. An unanswered token falls back to the
 * same underscore rule, so a half-finished draft reads as a blank form rather
 * than as the word "undefined".
 */

const RULE = "______________________________";

function money(value: string) {
  const n = Number(String(value).replace(/[^\d.]/g, ""));
  return Number.isFinite(n) && n > 0 ? n : 0;
}

function aadhaar(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits ? digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim() : "";
}

/**
 * The property address for a Tamil deed.
 *
 * The shared propertyAddress() ends "…, Tiruvallur District, Tamil Nadu" in
 * English, which reads as a splice in the middle of a Tamil sentence. Same
 * parts, same order, Tamil words.
 */
function tamilPropertyAddress(draft: AgreementDraft): string {
  const p = draft.property;
  return [
    [p.doorNo, p.buildingName].filter(Boolean).join(", "),
    p.street,
    p.locality,
    [p.city, p.pincode].filter(Boolean).join(" — "),
    p.district ? `${p.district} மாவட்டம், தமிழ்நாடு` : "தமிழ்நாடு",
  ]
    .filter(Boolean)
    .join(", ");
}

export function tamilTokens(draft: AgreementDraft): Record<string, string> {
  const t = draft.terms;
  const executed = t.executionDate ? new Date(t.executionDate) : null;
  const date = executed ? tamilDateParts(executed) : null;
  const rent = money(t.monthlyRent);
  const deposit = money(t.securityDeposit);
  const start = t.startDate ? new Date(t.startDate) : null;
  const end = start ? addMonths(start, t.durationMonths || 11) : null;

  return {
    execYear: date?.year ?? "",
    execMonth: date?.month ?? "",
    execDay: date?.day ?? "",
    nameA: draft.landlord.fullName,
    nameB: draft.tenant.fullName,
    parentA: draft.landlord.parentName,
    parentB: draft.tenant.parentName,
    startDate: start ? formatDateNumeric(start) : "",
    endDate: end ? formatDateNumeric(end) : "",
    aadhaarA: aadhaar(draft.landlord.aadhaar),
    aadhaarB: aadhaar(draft.tenant.aadhaar),
    addressA: draft.landlord.address,
    addressB: draft.tenant.address,
    propertyAddress: tamilPropertyAddress(draft),
    rent: rent ? rent.toLocaleString("en-IN") : "",
    rentWords: rent ? tamilNumberWords(rent) : "",
    deposit: deposit ? deposit.toLocaleString("en-IN") : "",
    depositWords: deposit ? tamilNumberWords(deposit) : "",
    rentDueDay: t.rentDueDay.replace(/\D/g, ""),
    noticeMonths: t.noticePeriodMonths,
  };
}

/**
 * The tokens in the service provider agreement, which is between two companies
 * rather than two people.
 */
export function contractTokens(draft: AgreementDraft): Record<string, string> {
  const t = draft.terms;
  const executed = t.executionDate ? new Date(t.executionDate) : null;
  const fee = money(t.securityDeposit);
  const party = (p: AgreementDraft["landlord"]) => p.companyName?.trim() || p.fullName;
  return {
    companyName: party(draft.landlord),
    providerName: party(draft.tenant),
    executionPlace: t.executionPlace,
    executionDate: executed
      ? executed.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
      : "",
    amount: fee ? fee.toLocaleString("en-IN") : "",
    // Always a rule: the document uses it where the counter writes something in.
    blank: "",
  };
}

/** Substitutes the answered tokens; anything unanswered reads as a blank rule. */
export function fillTokens(text: string, tokens: Record<string, string>): string {
  return text.replace(/\{\{(\w+)\}\}/g, (_, key: string) => {
    const value = tokens[key];
    return value && value.trim() ? value.trim() : RULE;
  });
}

export function fillTamilBody(id: TamilTemplateId, draft: AgreementDraft): TamilBlock[] {
  const tokens = tamilTokens(draft);
  return TAMIL_TEMPLATES[id].body.map((b) => ({ ...b, text: fillTokens(b.text, tokens) }));
}
