import type { AgreementDraft } from "./types";
import { addMonths, formatDate, inr, rupeesInWords } from "./utils";

export interface GeneratedClause {
  id: string;
  title: string;
  body: string;
  /** Shown as a chip in the builder so users see *why* a clause appeared. */
  trigger?: string;
  /** Always present regardless of selections. */
  core?: boolean;
}

const AGREEMENT_LABEL: Record<AgreementDraft["type"], string> = {
  residential: "Residential Rental Agreement",
  commercial: "Commercial Rental Agreement",
  lease: "Lease Deed",
  "leave-license": "Leave and License Agreement",
};

const PROPERTY_LABEL: Record<string, string> = {
  apartment: "apartment",
  "independent-house": "independent house",
  villa: "villa",
  office: "office premises",
  shop: "shop premises",
  warehouse: "warehouse",
  land: "parcel of land",
};

function n(value: string | number) {
  const parsed = typeof value === "number" ? value : parseFloat(value || "0");
  return Number.isFinite(parsed) ? parsed : 0;
}

export function agreementTitle(type: AgreementDraft["type"]) {
  return AGREEMENT_LABEL[type];
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
 * Builds the clause set from the user's answers. Every branch here maps to a
 * control in the builder, so the preview updates the instant a toggle flips.
 */
export function generateClauses(d: AgreementDraft): GeneratedClause[] {
  const clauses: GeneratedClause[] = [];
  const t = d.terms;
  const o = d.options;

  const rent = n(t.monthlyRent);
  const deposit = n(t.securityDeposit);
  const months = t.durationMonths || 11;
  const start = t.startDate ? new Date(t.startDate) : new Date();
  const end = addMonths(start, months);
  const kind = PROPERTY_LABEL[d.property.kind] ?? "premises";
  const isLicence = d.type === "leave-license";
  const partyA = isLicence ? "Licensor" : "Landlord";
  const partyB = isLicence ? "Licensee" : "Tenant";

  // ── 1. Grant ────────────────────────────────────────────────────────────
  clauses.push({
    id: "grant",
    core: true,
    title: `Grant of ${isLicence ? "Licence" : "Tenancy"}`,
    body: `The ${partyA} hereby grants to the ${partyB}, and the ${partyB} accepts, the ${isLicence ? "licence to occupy and use" : "right to occupy"} the ${kind} situated at ${propertyAddress(d)} (the "Premises"), for a term of ${months} (${months === 11 ? "eleven" : months}) months commencing on ${formatDate(start)} and ending on ${formatDate(end)}, on the terms recorded below.`,
  });

  // ── 2. Rent ─────────────────────────────────────────────────────────────
  clauses.push({
    id: "rent",
    core: true,
    title: isLicence ? "Licence Fee" : "Rent",
    body: `The ${partyB} shall pay to the ${partyA} a monthly ${isLicence ? "licence fee" : "rent"} of ${inr(rent)} (${rupeesInWords(rent)}), payable in advance on or before the ${t.rentDueDay || "5"} day of each calendar month${
      t.paymentMode === "cash"
        ? ", in cash against a written receipt"
        : t.paymentMode === "cheque"
          ? ", by account-payee cheque drawn in favour of the " + partyA
          : t.paymentMode === "upi"
            ? ", by UPI transfer to the account nominated by the " + partyA
            : ", by electronic bank transfer to the account nominated by the " + partyA
    }. ${
      t.paymentMode === "cash"
        ? "Every cash payment shall be acknowledged in writing; an unacknowledged payment shall not be treated as made."
        : "The bank record of the transfer shall be sufficient proof of payment."
    }`,
  });

  // ── 3. Deposit ──────────────────────────────────────────────────────────
  clauses.push({
    id: "deposit",
    core: true,
    title: "Security Deposit",
    body: `The ${partyB} has paid to the ${partyA} an interest-free refundable security deposit of ${inr(deposit)} (${rupeesInWords(deposit)}), the receipt of which the ${partyA} acknowledges. The deposit shall be refunded in full within 15 (fifteen) days of the ${partyB} handing over vacant possession, after deducting only (a) unpaid ${isLicence ? "licence fee" : "rent"}, (b) unpaid utility charges, and (c) the cost of repairing damage beyond normal wear and tear. The ${partyA} shall furnish an itemised written statement of every deduction. The deposit shall not be adjusted against ${isLicence ? "licence fee" : "rent"} during the term without the ${partyA}'s written consent.`,
  });

  // ── 4. Escalation (conditional) ─────────────────────────────────────────
  if (n(t.escalationPercent) > 0) {
    const afterMonths = n(t.escalationAfterMonths) || 11;
    clauses.push({
      id: "escalation",
      trigger: `Escalation ${t.escalationPercent}%`,
      title: "Escalation on Renewal",
      body: `If the parties renew this agreement, the monthly ${isLicence ? "licence fee" : "rent"} shall stand increased by ${t.escalationPercent}% over the then-prevailing amount at the end of every ${afterMonths} months of occupancy. No other increase may be imposed during a running term.`,
    });
  }

  // ── 5. Term, notice, lock-in ────────────────────────────────────────────
  const notice = n(t.noticePeriodMonths) || 1;
  clauses.push({
    id: "notice",
    core: true,
    title: "Termination and Notice",
    body: `Either party may terminate this agreement by giving the other ${notice} (${notice === 1 ? "one" : notice === 2 ? "two" : notice === 3 ? "three" : notice}) month${notice === 1 ? "" : "s"} prior written notice. In lieu of notice, the terminating party may pay ${isLicence ? "licence fee" : "rent"} for the unexpired notice period. The ${partyA} may terminate immediately if the ${isLicence ? "licence fee" : "rent"} remains unpaid for two consecutive months, or if the ${partyB} uses the Premises for any unlawful purpose.`,
  });

  if (n(t.lockInMonths) > 0) {
    const lock = n(t.lockInMonths);
    clauses.push({
      id: "lock-in",
      trigger: `Lock-in ${lock} months`,
      title: "Lock-in Period",
      body: `The parties agree to a lock-in period of ${lock} months from ${formatDate(start)}. Neither party may terminate this agreement during the lock-in period save for a material breach. Should the ${partyB} vacate before the lock-in expires, the ${isLicence ? "licence fee" : "rent"} for the unexpired portion of the lock-in shall become payable and may be adjusted against the security deposit. Should the ${partyA} require the ${partyB} to vacate before the lock-in expires, the ${partyA} shall pay the ${partyB} an equivalent sum.`,
    });
  }

  // ── 6. Maintenance ──────────────────────────────────────────────────────
  if (t.maintenanceBorneBy === "included") {
    clauses.push({
      id: "maintenance-included",
      trigger: "Maintenance included",
      title: "Maintenance Charges",
      body: `The monthly ${isLicence ? "licence fee" : "rent"} stated above is inclusive of association and common-area maintenance charges. The ${partyA} shall remain responsible for paying such charges to the association and shall keep the ${partyB} indemnified against any demand on that account.`,
    });
  } else if (t.maintenanceBorneBy === "tenant") {
    clauses.push({
      id: "maintenance-tenant",
      trigger: "Maintenance by tenant",
      title: "Maintenance Charges",
      body: `In addition to the ${isLicence ? "licence fee" : "rent"}, the ${partyB} shall pay maintenance charges of ${inr(n(t.maintenanceAmount))} per month${n(t.maintenanceAmount) > 0 ? "" : " as levied by the association"} directly to the apartment owners' association or the ${partyA}, as directed. Any increase levied by the association shall be borne by the ${partyB}.`,
    });
  } else {
    clauses.push({
      id: "maintenance-landlord",
      trigger: "Maintenance by landlord",
      title: "Maintenance Charges",
      body: `All association and common-area maintenance charges shall be borne by the ${partyA} and paid directly by the ${partyA}. The ${partyB} shall not be liable for any such demand.`,
    });
  }

  // ── 7. Utilities & taxes ────────────────────────────────────────────────
  clauses.push({
    id: "utilities",
    core: true,
    title: "Utilities and Statutory Dues",
    body: `Electricity consumption charges shall be borne by the ${t.electricityBorneBy === "tenant" ? partyB : partyA}, and water charges by the ${t.waterBorneBy === "tenant" ? partyB : partyA}, each paid on or before the due date. Property tax, and any other levy on the ownership of the Premises, shall be borne by the ${t.propertyTaxBorneBy === "landlord" ? partyA : partyB}. The ${partyB} shall hand over receipts for all utility payments at the end of the term, and shall clear every outstanding bill before vacating.`,
  });

  // ── 8. Use of premises ──────────────────────────────────────────────────
  if (d.type === "commercial" || o.commercialUseAllowed) {
    clauses.push({
      id: "commercial-use",
      trigger: "Commercial use",
      title: "Permitted Commercial Use",
      body: `The Premises shall be used solely for the purpose of ${o.businessNature || "the lawful business notified to the " + partyA} and for no other purpose. The ${partyB} shall obtain and maintain at its own cost every licence, registration, trade licence, and statutory approval required for that business, including under the Shops and Establishments Act and the Goods and Services Tax law. The ${partyB} shall not carry on any activity that is hazardous, that causes nuisance to neighbouring occupants, or that would void the insurance on the building. The ${partyA} shall not be answerable for any regulatory default of the ${partyB}'s business.`,
    });
  } else {
    clauses.push({
      id: "residential-use",
      core: true,
      title: "Use of the Premises",
      body: `The Premises shall be used strictly for residential purposes by the ${partyB} and the ${partyB}'s immediate family. No trade, business, manufacturing, storage of goods for sale, or commercial activity of any kind shall be carried on at the Premises. Nothing illegal, hazardous, or offensive shall be brought onto or done at the Premises.`,
    });
  }

  // ── 9. Furniture inventory ──────────────────────────────────────────────
  if (d.property.furnishing !== "unfurnished") {
    const items = d.furniture.filter((f) => f.name.trim());
    clauses.push({
      id: "furniture",
      trigger: d.property.furnishing === "fully-furnished" ? "Fully furnished" : "Semi furnished",
      title: "Fixtures, Fittings and Inventory",
      body: `The Premises are let on a ${d.property.furnishing.replace("-", " ")} basis. ${
        items.length
          ? `The following articles are handed over to the ${partyB} in working condition: ${items
              .map((f) => `${f.name}${n(f.quantity) > 1 ? ` (${f.quantity} nos., ${f.condition} condition)` : ` (${f.condition} condition)`}`)
              .join("; ")}.`
          : `A signed inventory of every article handed over forms Schedule B to this agreement.`
      } The ${partyB} shall return each article in the same condition, normal wear and tear excepted. The cost of repairing or replacing any article damaged or lost during the term shall be borne by the ${partyB} and may be deducted from the security deposit. The ${partyB} shall not remove any article from the Premises.`,
    });
  }

  // ── 10. Parking ─────────────────────────────────────────────────────────
  if (o.parkingIncluded) {
    const slots = n(o.parkingSlots) || 1;
    const vehicle =
      o.parkingType === "both"
        ? "two-wheeler and four-wheeler"
        : o.parkingType === "four-wheeler"
          ? "four-wheeler"
          : "two-wheeler";
    clauses.push({
      id: "parking",
      trigger: "Parking included",
      title: "Parking",
      body: `The ${partyA} shall provide the ${partyB} with ${slots} (${slots === 1 ? "one" : slots}) dedicated ${vehicle} parking slot${slots === 1 ? "" : "s"} within the premises for the exclusive use of the ${partyB}, at no additional charge. The ${partyB} shall park only in the allotted slot${slots === 1 ? "" : "s"} and shall not obstruct common passages. The ${partyA} shall not be liable for theft of or damage to any vehicle parked at the Premises.`,
    });
  } else {
    clauses.push({
      id: "no-parking",
      trigger: "No parking",
      title: "Parking",
      body: `No parking slot is allotted to the ${partyB} under this agreement. The ${partyB} shall not park any vehicle within the premises or in any common area without the prior written permission of the ${partyA} and the building association.`,
    });
  }

  // ── 11. Pets ────────────────────────────────────────────────────────────
  if (o.petsAllowed) {
    clauses.push({
      id: "pets",
      trigger: "Pets allowed",
      title: "Pets",
      body: `The ${partyB} may keep domestic pets at the Premises, subject to the bye-laws of the building association and to applicable municipal rules. The ${partyB} shall ensure that no pet causes nuisance, noise, or damage, shall keep all vaccinations current, and shall bear the full cost of repairing any damage caused by a pet. The ${partyB} shall have the Premises professionally cleaned and pest-treated before handing over possession.`,
    });
  } else {
    clauses.push({
      id: "no-pets",
      trigger: "No pets",
      title: "Pets",
      body: `The ${partyB} shall not keep any pet or animal at the Premises without the prior written consent of the ${partyA}.`,
    });
  }

  // ── 12. Subletting ──────────────────────────────────────────────────────
  clauses.push({
    id: "subletting",
    core: true,
    title: "Subletting and Assignment",
    body: o.sublettingAllowed
      ? `The ${partyB} may sublet or part with possession of the Premises, in whole or in part, only with the prior written consent of the ${partyA}. Any such subletting shall not relieve the ${partyB} of any obligation under this agreement, and the ${partyB} shall remain answerable to the ${partyA} for the acts of every occupant.`
      : `The ${partyB} shall not sublet, assign, mortgage, or otherwise part with possession of the Premises or any part of it, nor permit any third party to occupy the Premises, under any circumstances. Breach of this clause shall entitle the ${partyA} to terminate this agreement forthwith.`,
  });

  // ── 13. Alterations ─────────────────────────────────────────────────────
  clauses.push({
    id: "alterations",
    core: true,
    title: "Alterations and Structural Changes",
    body: o.alterationsAllowed
      ? `The ${partyB} may carry out non-structural alterations, fittings, and interior work at its own cost with the prior written consent of the ${partyA}. All such work shall comply with the bye-laws of the building. Any fixture affixed to the Premises may be removed by the ${partyB} at the end of the term provided the Premises are restored to their original condition.`
      : `The ${partyB} shall not make any structural alteration, addition, or permanent change to the Premises, nor drive nails or bore holes beyond what is ordinarily required to hang light fittings, without the prior written consent of the ${partyA}.`,
  });

  // ── 14. Repairs ─────────────────────────────────────────────────────────
  clauses.push({
    id: "repairs",
    core: true,
    title: "Repairs and Upkeep",
    body: `The ${partyA} shall attend to major and structural repairs, including to the roof, external walls, main plumbing lines, and electrical mains, at the ${partyA}'s own cost and within a reasonable time of being notified. Minor and day-to-day repairs — including to taps, switches, fuses, and sanitary fittings — up to ${inr(1000)} per instance shall be borne by the ${partyB}. The ${partyB} shall keep the Premises clean and in good order and shall report any defect promptly.`,
  });

  // ── 15. Inspection ──────────────────────────────────────────────────────
  clauses.push({
    id: "inspection",
    core: true,
    title: "Right of Inspection",
    body: `The ${partyA}, or a person authorised by the ${partyA}, may enter and inspect the Premises at a reasonable hour after giving the ${partyB} at least 24 hours' prior notice. During the final month of the term, the ${partyA} may show the Premises to prospective occupants on the same notice. The ${partyA} shall not enter the Premises without notice save in an emergency.`,
  });

  // ── 16. Handover ────────────────────────────────────────────────────────
  clauses.push({
    id: "handover",
    core: true,
    title: "Handing Over Possession",
    body: `On the expiry or earlier termination of this agreement, the ${partyB} shall hand over vacant and peaceful possession of the Premises to the ${partyA} in the same condition in which it was received, normal wear and tear excepted, together with all keys, access cards, and the articles listed in the inventory. The ${partyB} shall not be entitled to claim any tenancy right, and time shall be of the essence for handing over.`,
  });

  // ── 17. Registration ────────────────────────────────────────────────────
  if (o.registrationRequired || months >= 12) {
    clauses.push({
      id: "registration",
      trigger: months >= 12 ? "Term ≥ 12 months" : "Registration opted",
      title: "Registration",
      body: `This agreement shall be presented for registration before the jurisdictional Sub-Registrar at ${d.property.city || "the office having jurisdiction"} within the time prescribed by the Registration Act, 1908. The stamp duty and registration charges payable shall be borne by the ${partyB}${months >= 12 ? " unless the parties agree in writing to share them equally" : ""}. Both parties shall appear before the Sub-Registrar and do all things necessary to complete registration.`,
    });
  }

  // ── 18. Custom clauses ──────────────────────────────────────────────────
  o.customClauses
    .filter((c) => c.trim())
    .forEach((text, i) => {
      clauses.push({
        id: `custom-${i}`,
        trigger: "Your clause",
        title: `Special Condition ${i + 1}`,
        body: text.trim(),
      });
    });

  // ── 19. Governing law ───────────────────────────────────────────────────
  clauses.push({
    id: "governing-law",
    core: true,
    title: "Governing Law and Jurisdiction",
    body: `This agreement shall be governed by and construed in accordance with the laws of India, and in particular the Tamil Nadu Regulation of Rights and Responsibilities of Landlords and Tenants Act, 2017. The courts at ${d.property.district || d.property.city || "Chennai"}, Tamil Nadu shall have exclusive jurisdiction over any dispute arising out of this agreement. The parties shall first attempt to resolve any dispute amicably, and failing that by mediation, before approaching the Rent Authority or a court.`,
  });

  // ── 20. Entire agreement ────────────────────────────────────────────────
  clauses.push({
    id: "entire",
    core: true,
    title: "Entire Agreement",
    body: `This document records the entire understanding between the parties concerning the Premises and supersedes every prior discussion, representation, or arrangement, whether oral or written. No variation shall be effective unless made in writing and signed by both parties. If any clause is held unenforceable, the remaining clauses shall continue in full force.`,
  });

  return clauses;
}

/** Clause count without the user having to open the preview. */
export function clauseStats(d: AgreementDraft) {
  const all = generateClauses(d);
  return {
    total: all.length,
    conditional: all.filter((c) => c.trigger).length,
    triggers: all.filter((c) => c.trigger).map((c) => c.trigger as string),
  };
}
