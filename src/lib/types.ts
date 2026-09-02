import type { TemplateId } from "./agreement-templates";

export type AgreementType =
  | "residential"
  | "commercial"
  | "lease"
  | "leave-license"
  /**
   * Not a letting. A sale transfers ownership outright, so it has a buyer and
   * a seller rather than a landlord and a tenant, a price rather than a rent,
   * and none of the term, deposit or vacating clauses the other four share.
   */
  | "sale";

export type PlanId = "basic" | "standard" | "premium";

export type PartyType = "individual" | "company" | "huf" | "trust";

/**
 * How the party is described in the deed — "S/o", "D/o", "W/o", "H/o".
 * Executed Tamil Nadu agreements name the relationship explicitly rather than
 * hedging with "son/daughter of", and it is not always a parent: the sample we
 * were given records the landlord as "H/o: Nithyananthan".
 */
export type Relation = "son" | "daughter" | "wife" | "husband";

export interface Party {
  fullName: string;
  relation: Relation;
  parentName: string;
  partyType: PartyType;
  companyName: string;
  designation: string;
  age: string;
  phone: string;
  email: string;
  aadhaar: string;
  pan: string;
  address: string;
  city: string;
  pincode: string;
}

export type PropertyKind =
  | "apartment"
  | "independent-house"
  | "villa"
  | "office"
  | "shop"
  | "warehouse"
  | "land";

export type FurnishingLevel = "unfurnished" | "semi-furnished" | "fully-furnished";

export interface PropertyDetails {
  kind: PropertyKind;
  doorNo: string;
  buildingName: string;
  street: string;
  locality: string;
  city: string;
  district: string;
  pincode: string;
  builtUpArea: string;
  bedrooms: string;
  bathrooms: string;
  floor: string;
  /**
   * Letting a part of a building rather than all of it is the norm here — the
   * sample lets "a portion in the First Floor" of the landlord's own house.
   * The Schedule has to describe the portion, not the whole property.
   */
  wholeProperty: boolean;
  portionDescription: string;
  furnishing: FurnishingLevel;
  amenities: string[];
}

export type PaymentDay = string;

export interface AgreementTerms {
  /**
   * When the deed is signed, which is not when the tenancy starts. The sample
   * was executed on 1 December for a term running from the following March.
   */
  executionDate: string;
  executionPlace: string;
  startDate: string;
  durationMonths: number;
  monthlyRent: string;
  securityDeposit: string;
  rentDueDay: PaymentDay;
  paymentMode: "upi" | "bank-transfer" | "cheque" | "cash";
  escalationPercent: string;
  escalationAfterMonths: string;
  noticePeriodMonths: string;
  lockInMonths: string;
  maintenanceBorneBy: "tenant" | "landlord" | "included";
  maintenanceAmount: string;
  electricityBorneBy: "tenant" | "landlord";
  waterBorneBy: "tenant" | "landlord";
  propertyTaxBorneBy: "landlord" | "tenant";
  /** Handed over before signing, or due on signing. Changes the tense. */
  depositAlreadyPaid: boolean;
  /** Months of continuous default after which the landlord may evict. */
  defaultMonths: string;
}

export interface AgreementOptions {
  parkingIncluded: boolean;
  parkingType: "two-wheeler" | "four-wheeler" | "both";
  parkingSlots: string;
  petsAllowed: boolean;
  sublettingAllowed: boolean;
  commercialUseAllowed: boolean;
  businessNature: string;
  alterationsAllowed: boolean;
  /** No nails in the walls; repaint on vacating if there are. */
  noWallDamage: boolean;
  /** No illegal or anti-social use, and no liquor on the premises. */
  noLiquorOrIllegalUse: boolean;
  registrationRequired: boolean;
  lawyerReview: boolean;
  witnessRequired: boolean;
  customClauses: string[];
  /**
   * Rewritten wording for a generated clause, keyed by clause id.
   *
   * Every deed has something the standard wording does not cover — a rent-free
   * fit-out month, a particular parking bay, whose name the electricity card is
   * in. Rather than send those to the office as a note that has to be typed in
   * again, the customer edits the clause itself and the edit travels with the
   * draft into the PDF.
   */
  clauseEdits: Record<string, string>;
  /** Generated clauses the customer has struck out. Core clauses cannot be struck. */
  removedClauseIds: string[];
}

export interface FurnitureItem {
  id: string;
  name: string;
  quantity: string;
  condition: "new" | "good" | "fair";
}

/**
 * The thing being sold, for the sale instruments.
 *
 * Kept separate from PropertyDetails because a vehicle is not premises: it has
 * no address, no floor and no schedule, and what identifies it — the
 * registration, engine and chassis numbers — has no counterpart in a letting.
 */
export interface SaleDetails {
  /** Only two-wheelers so far. */
  kind: "two-wheeler";
  registrationNumber: string;
  makeModel: string;
  manufactureYear: string;
  engineNumber: string;
  chassisNumber: string;
  /** Rupees. The whole consideration, paid before or at handover. */
  price: string;
  handoverDate: string;
  /** Executed sale notes exist to the minute — "handed over at 7.30 PM". */
  handoverTime: string;
  /** Days the buyer has to get the registration certificate transferred. */
  transferWithinDays: string;
  /** Keys and the papers that came with the vehicle. */
  documentsHandedOver: boolean;
}

export interface AgreementDraft {
  id: string;
  type: AgreementType;
  /** Which of the twenty-four signed-off templates this deed is drawn from. */
  templateId: TemplateId;
  plan: PlanId;
  landlord: Party;
  tenant: Party;
  property: PropertyDetails;
  /** Populated for the sale instruments; ignored by the lettings. */
  sale: SaleDetails;
  terms: AgreementTerms;
  options: AgreementOptions;
  furniture: FurnitureItem[];
  updatedAt: string;
}

export interface StampDutyBreakdown {
  totalRentOverTerm: number;
  refundableDeposit: number;
  chargeableValue: number;
  stampDuty: number;
  registrationFee: number;
  registrationRequired: boolean;
  platformFee: number;
  lawyerFee: number;
  gst: number;
  total: number;
  notes: string[];
}

export type OrderStatus =
  | "draft"
  | "payment-pending"
  | "lawyer-review"
  | "e-stamp"
  | "awaiting-signature"
  | "completed"
  | "expiring";
