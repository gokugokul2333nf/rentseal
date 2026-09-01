import type { AgreementDraft } from "./types";
import { DEFAULT_TEMPLATE_BY_TYPE, TEMPLATE_SPECS, type TemplateSpec } from "./agreement-templates";
import { addMonths, formatDateNumeric, inr, rupeesInWords } from "./utils";

export interface GeneratedClause {
  id: string;
  title: string;
  body: string;
  /** Shown as a chip in the builder so users see *why* a clause appeared. */
  trigger?: string;
  /** Always present regardless of selections. */
  core?: boolean;
}

/**
 * The template behind a draft, falling back to the instrument's default.
 *
 * Drafts saved before templates existed have no templateId, and a returning
 * customer must not be shown a blank deed because of it.
 */
export function specFor(d: AgreementDraft): TemplateSpec {
  return TEMPLATE_SPECS[d.templateId] ?? TEMPLATE_SPECS[DEFAULT_TEMPLATE_BY_TYPE[d.type]];
}

function n(value: string | number) {
  const parsed = typeof value === "number" ? value : parseFloat(value || "0");
  return Number.isFinite(parsed) ? parsed : 0;
}

/** The heading the deed carries — "SHOP RENTAL AGREEMENT", "LEASE DEED". */
export function agreementTitle(d: AgreementDraft) {
  return specFor(d).deedTitle;
}

export function scheduleHeading(d: AgreementDraft) {
  return specFor(d).scheduleHeading;
}

/**
 * How the let premises are described in the Schedule.
 *
 * A portion has to be named as a portion — "a portion in the First Floor of
 * No.5/185, …" — because a Schedule that describes the whole building when only
 * one floor is let describes the wrong thing.
 */
export function scheduleDescription(d: AgreementDraft) {
  const address = propertyAddress(d);
  if (d.property.wholeProperty) return address;
  const portion = d.property.portionDescription.trim();
  return portion ? `${portion} of ${address}` : `a portion of ${address}`;
}

export function propertyAddress(d: AgreementDraft) {
  const p = d.property;
  return [
    [p.doorNo, p.buildingName].filter(Boolean).join(", "),
    p.street,
    p.locality,
    [p.city, p.pincode].filter(Boolean).join(" — "),
    p.district ? `${p.district} District, Tamil Nadu` : "Tamil Nadu",
  ]
    .filter(Boolean)
    .join(", ");
}

/**
 * The clause set, following the executed agreement the client supplied.
 *
 * That document is the template: same order, same wording, same numbering. It
 * is a working Chennai rental agreement of the kind the Sub-Registrar and the
 * parties both expect, and it is short — sixteen clauses where the generic
 * draft this replaced ran to twenty-three of considerably more verbose prose.
 *
 * Everything variable comes from the builder's answers, so a clause only says
 * "three months' notice" or "two months' default" because someone chose it.
 * Clauses the sample does not have appear only when an answer calls for them —
 * parking, pets, furniture, commercial use, registration.
 */
export function generateClauses(d: AgreementDraft): GeneratedClause[] {
  const clauses: GeneratedClause[] = [];
  const t = d.terms;
  const o = d.options;
  const spec = specFor(d);
  const A = spec.roleA;
  const B = spec.roleB;
  const rentWord = spec.moneyWord;

  const rent = n(t.monthlyRent);
  const deposit = n(t.securityDeposit);
  const months = t.durationMonths || 11;
  const notice = n(t.noticePeriodMonths) || 1;
  const defaults = n(t.defaultMonths) || 2;
  const start = t.startDate ? new Date(t.startDate) : new Date();
  const end = addMonths(start, months);
  const purpose = spec.purpose;

  // 1 ── Rent
  clauses.push({
    id: "rent",
    core: true,
    title: "Rent",
    body: `The monthly ${rentWord} for the premises hereby let-out to the ${B} is ${inr(rent)} (${rupeesInWords(rent)}) and the ${B} has agreed to pay it on or before the ${t.rentDueDay} of every succeeding calendar month.`,
  });

  // 2 ── Deposit
  clauses.push({
    id: "deposit",
    core: true,
    title: "Security Deposit",
    body: `The ${B} has agreed to pay a deposit of ${inr(deposit)} (${rupeesInWords(deposit)}). ${
      t.depositAlreadyPaid
        ? `The ${B} has paid this deposit to the ${A}.`
        : `The ${B} shall pay this deposit to the ${A} on or before the date the tenancy commences.`
    }`,
  });

  // 3 ── Deposit carries no interest, refundable on vacating
  clauses.push({
    id: "deposit-refund",
    core: true,
    title: "Refund of Deposit",
    body: `The aforesaid security deposit will not carry any interest and the ${A} shall return this amount to the ${B} at the time of vacating and delivering vacant possession of the demised premises as it is let-out to ${B === "TENANT" ? "the TENANT" : "the LICENSEE"} this day.`,
  });

  // 4 ── Electricity
  if (t.electricityBorneBy === "tenant") {
    clauses.push({
      id: "electricity",
      core: true,
      title: "Electricity Charges",
      body: `The ${B} shall pay separately the electricity charges, according to the meter readings for the demised portion, directly to the T.N.E.B.`,
    });
  }

  // 5 ── Deductions from the deposit
  clauses.push({
    id: "deductions",
    core: true,
    title: "Deductions on Vacating",
    body: `The ${A} will be at liberty to deduct all such amounts as ${rentWord} dues, electricity charges and other arrears, and also any damages to the building, wood work, electrical fittings and plumbing taps, at the time of the ${B} vacating the portion.`,
  });

  // 6 ── Nails (conditional)
  if (o.noWallDamage) {
    clauses.push({
      id: "nails",
      trigger: "No nails",
      title: "Nails and Wall Finishes",
      body: `The ${B} shall not hammer any nails on the walls of the premises. If nails are hammered, the walls have to be cemented and the premises have to be painted in full and handed over at the time of vacating the said property.`,
    });
  }

  // 7 ── Term
  clauses.push({
    id: "term",
    core: true,
    title: "Period of Tenancy",
    body: `The tenancy shall be in force for a period of ${months} months commencing from ${formatDateNumeric(start)} to ${formatDateNumeric(end)}.`,
  });

  // 8 ── Renewal
  clauses.push({
    id: "renewal",
    core: true,
    title: "Renewal",
    body: `Both the ${A} and the ${B} agree that the period of tenancy may be extended for a further period of ${months} months by mutual consent on fresh terms and conditions.${
      n(t.escalationPercent) > 0
        ? ` On such renewal the monthly ${rentWord} shall stand increased by ${t.escalationPercent}%.`
        : ""
    }`,
  });

  // 9 ── Alterations
  clauses.push({
    id: "alterations",
    core: true,
    title: "Alterations",
    body: o.alterationsAllowed
      ? `The ${B} may carry out non-structural interior work with the written consent of the ${A}, but shall not make any structural alterations or additions without such consent, and shall restore the premises before vacating.`
      : `The ${B} shall not make any structural alterations or additions without the written consent of the ${A}.`,
  });

  // 10 ── Subletting
  clauses.push({
    id: "subletting",
    core: true,
    title: "Subletting",
    body: o.sublettingAllowed
      ? `The ${B} shall not sublet the demised premises or any part thereof to any third party without the prior written consent of the ${A}.`
      : `The ${B} shall not sublet the demised premises or any part thereof to any third parties.`,
  });

  // 11 ── Inspection
  clauses.push({
    id: "inspection",
    core: true,
    title: "Right of Inspection",
    body: `The ${A} or the ${A}'s authorised representatives shall be at liberty to inspect the demised premises at all reasonable times without any interruption by the ${B}.`,
  });

  // 12 ── Change of use
  clauses.push({
    id: "use",
    core: true,
    title: "Use of the Premises",
    body: `The ${B} shall not alter the use of the demised premises, which are let for ${purpose.toLowerCase()}, without the written consent of the ${A}.`,
  });

  // 13 ── Default
  clauses.push({
    id: "default",
    core: true,
    title: "Default in Payment",
    body: `The ${A} has every right to evict the ${B} irrespective of this agreement if the ${B} commits default in payment of monthly ${rentWord} for a continuous period of ${defaults} month${defaults === 1 ? "" : "s"}.`,
  });

  // 14 ── Notice
  clauses.push({
    id: "notice",
    core: true,
    title: "Termination",
    body: `This agreement is terminable by ${notice} month${notice === 1 ? "" : "s"} notice in advance on either side.`,
  });

  // 15 ── Governing law
  clauses.push({
    id: "law",
    core: true,
    title: "Governing Law",
    body: `The law in force shall otherwise govern this agreement.`,
  });

  // 16 ── Anti-social use (conditional)
  if (o.noLiquorOrIllegalUse) {
    clauses.push({
      id: "lawful-use",
      trigger: "No liquor",
      title: "Lawful Use",
      body: `The ${B} shall not use the demised premises for any anti-social or illegal activities, and shall not consume or store liquor on the premises.`,
    });
  }

  /* ── Beyond the sample: only where an answer asks for it ──────────────── */

  if (n(t.lockInMonths) > 0) {
    const lock = n(t.lockInMonths);
    clauses.push({
      id: "lock-in",
      trigger: `Lock-in ${lock} months`,
      title: "Lock-in Period",
      body: `Neither party shall terminate this agreement during the first ${lock} months of the term. If the ${B} vacates within that period, the ${rentWord} for the unexpired part of the lock-in shall be payable to the ${A}.`,
    });
  }

  if (t.maintenanceBorneBy === "tenant" && n(t.maintenanceAmount) > 0) {
    clauses.push({
      id: "maintenance",
      trigger: "Maintenance by tenant",
      title: "Maintenance Charges",
      body: `In addition to the ${rentWord}, the ${B} shall pay maintenance charges of ${inr(n(t.maintenanceAmount))} per month to the association or to the ${A} as directed.`,
    });
  }

  if (d.property.furnishing !== "unfurnished" && d.furniture.length > 0) {
    clauses.push({
      id: "inventory",
      trigger: d.property.furnishing.replace("-", " "),
      title: "Inventory of Articles",
      body: `The premises are let on a ${d.property.furnishing.replace("-", " ")} basis. The articles handed over are listed in the Schedule of Articles annexed to this agreement. The ${B} shall return each article in the same condition, normal wear and tear excepted.`,
    });
  }

  if (o.parkingIncluded) {
    clauses.push({
      id: "parking",
      trigger: "Parking included",
      title: "Parking",
      body: `The ${A} shall provide the ${B} with ${o.parkingSlots} ${o.parkingType.replace("-", " ")} parking slot(s) within the premises. The ${A} shall not be liable for theft of or damage to any vehicle parked at the premises.`,
    });
  }

  if (o.petsAllowed) {
    clauses.push({
      id: "pets",
      trigger: "Pets allowed",
      title: "Pets",
      body: `The ${B} may keep domestic pets at the premises, subject to municipal rules and the bye-laws of the association, and shall make good any damage caused by them.`,
    });
  }

  if (d.type === "commercial" || o.commercialUseAllowed) {
    clauses.push({
      id: "commercial-use",
      trigger: "Commercial use",
      title: "Permitted Business",
      body: `The premises shall be used solely for the purpose of ${o.businessNature || `the lawful business notified to the ${A}`} and for no other purpose. The ${B} shall obtain and maintain every licence, registration and statutory approval required for that business at the ${B}'s own cost.`,
    });
  }

  if (o.registrationRequired) {
    clauses.push({
      id: "registration",
      trigger: "Registration",
      title: "Registration",
      body: `This agreement shall be registered before the jurisdictional Sub-Registrar. The registration charges and stamp duty shall be borne by the ${B} unless otherwise agreed in writing.`,
    });
  }

  /* ── The template's own clauses, transcribed from the signed-off document ── */

  spec.clauses.forEach((body, i) => {
    clauses.push({
      id: `tpl-${i + 1}`,
      trigger: "Template clause",
      title: "Special Condition",
      body,
    });
  });

  o.customClauses.forEach((text, i) => {
    if (!text.trim()) return;
    clauses.push({
      id: `custom-${i}`,
      trigger: "Your clause",
      title: "Special Condition",
      body: text.trim(),
    });
  });

  // Struck-out and rewritten clauses are applied last so an edit survives
  // whatever produced the clause -- core, template or the customer's own.
  return clauses
    .filter((c) => c.core || !o.removedClauseIds?.includes(c.id))
    .map((c) => {
      const edited = o.clauseEdits?.[c.id];
      return edited && edited.trim()
        ? { ...c, body: edited.trim(), trigger: c.trigger ?? "Edited" }
        : c;
    });
}

export function clauseStats(d: AgreementDraft) {
  const all = generateClauses(d);
  return {
    total: all.length,
    conditional: all.filter((c) => c.trigger).length,
    // Deduplicated: these are summary chips, and the builder keys them by
    // label. Five template clauses all reading "Template clause" would collide
    // as React keys and tell the reader nothing five times over.
    triggers: [...new Set(all.filter((c) => c.trigger).map((c) => c.trigger as string))],
  };
}
