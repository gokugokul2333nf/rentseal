/**
 * Stamp paper catalogue and delivery model.
 *
 * Tamil Nadu supplies non-judicial stamp paper through licensed vendors and
 * e-Stamp certificates through the authorised channel. We procure both at face
 * value and charge only for the errand — the denominations below are the ones
 * ordinary transactions actually call for.
 */

export interface Denomination {
  value: number;
  label: string;
  popular?: boolean;
  uses: string[];
  note?: string;
}

export const DENOMINATIONS: Denomination[] = [
  {
    value: 20,
    label: "₹20",
    uses: ["Affidavits", "Declarations", "Undertakings", "Name change"],
  },
  {
    value: 50,
    label: "₹50",
    uses: ["Indemnity bonds", "Guarantee letters", "Sworn statements", "Gap certificates"],
  },
  {
    value: 100,
    label: "₹100",
    popular: true,
    uses: ["Rental agreements", "Power of attorney", "No-objection certificates", "General agreements"],
    note: "The denomination most 11-month rental agreements in Tamil Nadu are executed on.",
  },
  {
    value: 200,
    label: "₹200",
    uses: ["Partnership deeds", "Loan agreements", "Job contracts", "Franchise agreements"],
  },
  {
    value: 500,
    label: "₹500",
    uses: ["Commercial agreements", "Sale agreements", "Higher-value bonds", "Settlement deeds"],
  },
  {
    value: 0,
    label: "Any value",
    uses: ["Lease deeds", "Sale deeds", "Mortgage deeds", "Development agreements"],
    note: "Issued as an e-Stamp certificate for any amount from ₹1 upward, against the exact duty payable.",
  },
];

export interface DeliveryZone {
  id: string;
  name: string;
  districts: string[];
  eta: string;
  charge: number;
  cutOff?: string;
}

export const DELIVERY_ZONES: DeliveryZone[] = [
  {
    id: "metro",
    name: "Chennai metro",
    districts: ["Chennai", "Chengalpattu", "Kancheepuram", "Tiruvallur"],
    eta: "Same day",
    charge: 99,
    cutOff: "Order before 2 pm",
  },
  {
    id: "tier-2",
    name: "Major cities",
    districts: [
      "Coimbatore",
      "Madurai",
      "Tiruchirappalli",
      "Salem",
      "Tiruppur",
      "Erode",
      "Vellore",
      "Hosur",
      "Tirunelveli",
      "Thoothukudi",
    ],
    eta: "Next working day",
    charge: 149,
  },
  {
    id: "state",
    name: "Every other district",
    districts: ["All remaining districts of Tamil Nadu"],
    eta: "2 – 3 working days",
    charge: 149,
  },
];

export const DELIVERY_RULES = {
  freeAbove: 2000,
  bulkFreeFrom: 10,
  digitalInstant: true,
} as const;

export interface StampUseCase {
  title: string;
  denomination: string;
  body: string;
}

export const STAMP_USE_CASES: StampUseCase[] = [
  {
    title: "Rental & lease agreements",
    denomination: "₹100 or exact duty",
    body: "For an 11-month let, most people use ₹100 paper. Where the agreement runs 12 months or longer, duty is charged at 1% of the total rent plus deposit and we issue an e-Stamp for that exact figure.",
  },
  {
    title: "Affidavits & declarations",
    denomination: "₹20",
    body: "Name change, date of birth correction, address proof, single-status affidavits and the sworn statements colleges and passport offices ask for.",
  },
  {
    title: "Indemnity & surety bonds",
    denomination: "₹50 – ₹100",
    body: "Employment bonds, gap certificates, loss-of-document indemnities, and the guarantee letters banks and employers commonly require.",
  },
  {
    title: "Business & partnership deeds",
    denomination: "₹200 – ₹500",
    body: "Partnership deeds, LLP agreements, vendor contracts, franchise agreements and commercial leases where a higher denomination is prescribed.",
  },
  {
    title: "Property instruments",
    denomination: "Exact duty, e-Stamp",
    body: "Sale agreements, mortgage deeds, gift and settlement deeds, development agreements — where duty runs into thousands and only an e-Stamp certificate will do.",
  },
  {
    title: "Power of attorney",
    denomination: "₹100",
    body: "General and special powers of attorney, authorisation letters and the consent instruments registrars ask to see.",
  },
];

/** Delivery charge for a given zone and order value. */
export function deliveryCharge(zoneId: string, stampValue: number, sheets = 1) {
  if (stampValue >= DELIVERY_RULES.freeAbove) return 0;
  if (sheets >= DELIVERY_RULES.bulkFreeFrom) return 0;
  return DELIVERY_ZONES.find((z) => z.id === zoneId)?.charge ?? 149;
}
