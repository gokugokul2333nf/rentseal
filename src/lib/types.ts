export type AgreementType =
  | "residential"
  | "commercial"
  | "lease"
  | "leave-license";

export type PlanId = "basic" | "standard" | "premium";

export type PartyType = "individual" | "company" | "huf" | "trust";

export interface Party {
  fullName: string;
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
  furnishing: FurnishingLevel;
  amenities: string[];
}

export type PaymentDay = string;

export interface AgreementTerms {
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
  registrationRequired: boolean;
  lawyerReview: boolean;
  witnessRequired: boolean;
  customClauses: string[];
}

export interface FurnitureItem {
  id: string;
  name: string;
  quantity: string;
  condition: "new" | "good" | "fair";
}

export interface AgreementDraft {
  id: string;
  type: AgreementType;
  plan: PlanId;
  landlord: Party;
  tenant: Party;
  property: PropertyDetails;
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
