import type { AgreementType } from "./types";
import type { ContractBlock } from "./service-provider-template";

/**
 * Four more documents the office supplied, held verbatim.
 *
 * An indemnity bond for a mislaid jewel loan slip, an affidavit proving a death
 * that was never registered, an undertaking for a temporary electricity
 * connection, and a private loan agreement. Three arrived executed — real
 * names, Aadhaar numbers, addresses, a ten-lakh loan — and everything
 * identifying is a {{token}} the form fills or a blank rule the counter
 * completes. The electricity undertaking arrived already blank; its rows of
 * dots are rules now.
 */

export interface DeedTemplate {
  id: DeedTemplateId;
  baseType: AgreementType;
  name: string;
  deedTitle: string;
  roleA: string;
  /** Empty where the deed is one-sided. */
  roleB: string;
  description: string;
  body: ContractBlock[];
}

export type DeedTemplateId =
  | "indemnity-jewel-slip"
  | "death-proof-affidavit"
  | "eb-temporary-connection"
  | "loan-agreement"
  ;

export const DEED_TEMPLATES: Record<DeedTemplateId, DeedTemplate> = {
  "indemnity-jewel-slip": {
    id: "indemnity-jewel-slip",
    baseType: "deed",
    name: "Indemnity Bond — Lost Jewel Loan Slip",
    deedTitle: "INDEMNITY BOND",
    roleA: "BORROWER",
    roleB: "LENDER",
    description: "For a pledged-jewels loan slip that has been mislaid. The bank issues a duplicate against this indemnity.",
    body: [
      { text: "INDEMNITY BOND FOR LOSS OF JEWEL LOAN IDENTITY SLIP", heading: true },
      { text: "This deed of indemnity executed at {{executionPlace}} by {{nameA}}, aged ___ years, S/o Thiru {{parentA}}, residing at {{addressA}}, hereinafter referred to as the Borrower." },
      { text: "Whereas the Borrower had on {{executionDate}} borrowed a sum of Rs. {{amount}}/- (Rupees {{amountWords}} only) from __________________________ Branch / Head Office of the Lender Bank against the pledge of jewellery as detailed below." },
      { text: "DETAILS OF JEWELS PLEDGED:", heading: true },
      { text: "S.No  |  Particulars  |  Nos  |  Gross Weight (grams)  |  Net Weight (grams)  |  Net Value (Rs.)" },
      { text: "1.  |  __________________________  |  __________________________  |  __________________________  |  __________________________  |  __________________________" },
      { text: "2.  |  __________________________  |  __________________________  |  __________________________  |  __________________________  |  __________________________" },
      { text: "Where as the Lender had at the time of pledge, issued to the Borrower a Jewel Loan Identity Slip, acknowledging the pledge and particulars of the jewels pledged, whereas the Borrower, at the time when he/she redeems the pledged jewels, has to return the Jewel-Loan identity Slip issued by the Lender." },
      { text: "Whereas the Borrower has misplaced the said jewel Loan identity Slip and is not able to produce the same in spite of diligent search. And whereas the Lender required a deed of indemnity to be executed in favour of the Lender indemnifying the bank against any claim in respect of said pledge of jewels by reason of the loss of the said Jewel Loan identity Slip and by production of the original by third party." },
      { text: "Now therefore this Deed of Indemnity Witnesseth that in pursuance thereof and in consideration of the Lender delivering a duplicate of the Jewel Loan Identity Slip in place of the lost jewel Loan identity slip for the pledged jewels only to the party of the I part (borrower), the part of the I part hereby agrees to indemnity the Lender Bank, the party of the __________________________ part, against any claim, loss, damage or expenses that may be incurred by the party of Il party by reason of such loss of the original of the jewel Loan identity Slip and by production and claim any, of the original Jewel" },
      { text: "Loan Identity Slip No. __________________________ dated {{date}}." },
      { text: "To this effect this Deed of Indemnity executed at {{place}} on this {{date}}." },
      { text: "Borrower (Party of the 1st Part)", heading: true },
      { text: "WITNESSES:", heading: true },
      { text: "1." },
      { text: "2." },
    ],
  },
  "death-proof-affidavit": {
    id: "death-proof-affidavit",
    baseType: "deed",
    name: "Death Proof Affidavit",
    deedTitle: "DEATH PROOF AFFIDAVIT",
    roleA: "DEPONENT",
    // Not a second signatory — the person whose death is being sworn to. The
    // form asks for the name so the deed can print it; only the deponent signs.
    roleB: "THE DECEASED",
    description: "Where a death was never registered and no certificate exists, sworn by a surviving relative.",
    body: [
      { text: "DEATH PROOF AFFIDAVIT", heading: true },
      { text: "I, {{nameA}}, S/o Late {{parentA}}, residing at {{addressA}}, do hereby solemnly affirm and declare as under." },
      { text: "That my grandfather {{nameB}}, S/o Late __________________________, died on {{executionDate}} at __________________________. Since the death was not registered at the time, no death certificate was issued." },
      { text: "I hereby confirm and declare that the correct date of death of {{nameB}} is {{executionDate}}, and the same may kindly be accepted for all official and other purposes." },
      { text: "DEPONENT", heading: true },
      { text: "Solemnly affirmed and signed before me at {{place}} on {{date}}." },
      { text: "WITNESSES:", heading: true },
      { text: "1." },
      { text: "2." },
    ],
  },
  "eb-temporary-connection": {
    id: "eb-temporary-connection",
    baseType: "deed",
    name: "Undertaking — Temporary Electricity Connection",
    deedTitle: "UNDERTAKING",
    roleA: "APPLICANT",
    roleB: "",
    description: "Regulation 39 of the Tamil Nadu Electricity Distribution Code, for a temporary supply during construction.",
    body: [
      { text: "UNDERTAKING", heading: true },
      { text: "(Regulation 39 of the Tamil Nadu Electricity Distribution Code)", heading: true },
      { text: "I/We, {{nameA}}, S/o {{parentA}}, aged ___ years, residing at {{addressA}}, am/are constructing a building at __________________________ (site address)." },
      { text: "This construction is a New Building construction/additional construction beyond __________________________Sq,ft. I seek to avail temporary service connection for the said building construction." },
      { text: "Upon completion of construction activity, I undertake to convert the service connection now sought for into permanent supply at appropriate tariff category,," },
      { text: "in accordance with the Regulation in force." },
      { text: "I also undertake to pay all applicable charges as per Regulation 39 of Tamil Nadu Electricity Distribution Code." },
      { text: "Signature of the applicant" },
      { text: "To" },
      { text: "The Assistant Executive Engineer/ O & M" },
      { text: "__________________________Sub-division," },
      { text: "__________________________ Division." },
    ],
  },
  "loan-agreement": {
    id: "loan-agreement",
    baseType: "deed",
    name: "Loan Agreement",
    deedTitle: "LOAN AGREEMENT",
    roleA: "LENDER",
    roleB: "BORROWER",
    description: "A private loan between two people — amount, interest and the date it falls due.",
    body: [
      { text: "LOAN AGREEMENT", heading: true },
      { text: "This LOAN Agreement is executed on {{date}}" },
      { text: "BETWEEN", heading: true },
      { text: "{{nameA}} (Aadhaar No. {{aadhaarA}}), S/o {{parentA}}, residing at {{addressA}}, hereinafter referred to as the LENDER." },
      { text: "AND", heading: true },
      { text: "{{nameB}} (Aadhaar No. {{aadhaarB}}), S/o {{parentB}}, residing at {{addressB}}, hereinafter referred to as the BORROWER." },
      { text: "The LENDER has issued a loan of Rs. {{amount}}/- (Rupees {{amountWords}} only) to the BORROWER for personal purposes, carrying interest at __________________________% per month, repayable on or before {{repayBy}}." },
      { text: "IN WITNESS WHEREOF, the undersigned has executed this Note as of the date first stated above." },
      { text: "LENDER                                        BORROWER", heading: true },
      { text: "WITNESSES:", heading: true },
      { text: "1." },
      { text: "2." },
    ],
  },
};

export const DEED_TEMPLATE_IDS = Object.keys(DEED_TEMPLATES) as DeedTemplateId[];
