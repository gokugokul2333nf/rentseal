import { DISTRICTS } from "./districts";

/**
 * PIN code checking for Tamil Nadu addresses.
 *
 * Three separate things go wrong, and they deserve different treatment:
 *
 *   - a number that is not a PIN code at all (five digits, seven digits) is a
 *     typo and should stop you;
 *   - a well-formed PIN outside Tamil Nadu's ranges is either a typo or a
 *     property we do not serve, and should stop you;
 *   - a valid Tamil Nadu PIN that belongs to a different district than the one
 *     selected is usually a typo, but the postal map and the revenue map do not
 *     agree everywhere, so it only warns.
 *
 * The prefix table is deliberately coarse — first three digits, and a set of
 * districts per prefix rather than one. Chennai's 600 series alone runs into
 * Tiruvallur, Chengalpattu and Kancheepuram, and the districts carved out in
 * 2019–20 (Chengalpattu, Kallakurichi, Ranipet, Tirupathur, Tenkasi,
 * Mayiladuthurai) kept the PIN codes of the districts they were cut from. A
 * confident-looking exact map would reject correct addresses, which is worse
 * than not checking at all.
 */

/** First three digits → the districts that series covers. */
const PREFIX_DISTRICTS: Record<string, string[]> = {
  "600": ["Chennai", "Tiruvallur", "Chengalpattu", "Kancheepuram"],
  "601": ["Tiruvallur", "Kancheepuram"],
  "602": ["Tiruvallur", "Kancheepuram"],
  "603": ["Chengalpattu", "Kancheepuram"],
  "604": ["Tiruvannamalai", "Viluppuram", "Kancheepuram"],
  "605": ["Viluppuram", "Cuddalore"],
  "606": ["Tiruvannamalai", "Kallakurichi", "Viluppuram"],
  "607": ["Cuddalore"],
  "608": ["Cuddalore"],
  "609": ["Nagapattinam", "Mayiladuthurai", "Tiruvarur"],
  "610": ["Tiruvarur"],
  "611": ["Nagapattinam"],
  "612": ["Thanjavur", "Mayiladuthurai"],
  "613": ["Thanjavur"],
  "614": ["Thanjavur", "Tiruvarur", "Pudukkottai"],
  "620": ["Tiruchirappalli"],
  "621": ["Tiruchirappalli", "Ariyalur", "Perambalur"],
  "622": ["Pudukkottai"],
  "623": ["Ramanathapuram", "Sivaganga"],
  "624": ["Dindigul"],
  // Theni shares Madurai's 625 series rather than having one of its own.
  "625": ["Madurai", "Theni"],
  "626": ["Virudhunagar"],
  "627": ["Tirunelveli", "Tenkasi"],
  "628": ["Thoothukudi"],
  "629": ["Kanyakumari"],
  "630": ["Sivaganga"],
  "631": ["Ranipet", "Vellore", "Tiruvallur"],
  "632": ["Vellore", "Ranipet", "Tirupathur"],
  "635": ["Krishnagiri", "Dharmapuri", "Tirupathur"],
  "636": ["Salem", "Namakkal", "Dharmapuri"],
  "637": ["Namakkal", "Salem"],
  "638": ["Erode", "Tiruppur"],
  "639": ["Karur"],
  "641": ["Coimbatore", "Tiruppur"],
  "642": ["Tiruppur", "Coimbatore"],
  "643": ["Nilgiris"],
};

export type PincodeStatus = "empty" | "incomplete" | "invalid" | "outside" | "mismatch" | "ok";

export interface PincodeCheck {
  status: PincodeStatus;
  /** Set for every status except "empty" and "ok". */
  message?: string;
  /** Districts the PIN belongs to, when we recognise the series. */
  districts?: string[];
}

const normalise = (value: string) => value.replace(/\D/g, "");

const clean = (s: string) => s.toLowerCase().replace(/[^a-z]/g, "");

/**
 * What people actually type where a district is asked for.
 *
 * Colloquial and pre-rename names only — anything that is a real town in the
 * district is caught by the town lists in districts.ts instead of being
 * repeated here.
 */
const ALIASES: Record<string, string> = {
  trichy: "Tiruchirappalli",
  trichinopoly: "Tiruchirappalli",
  madras: "Chennai",
  tanjore: "Thanjavur",
  tuticorin: "Thoothukudi",
  nellai: "Tirunelveli",
  kanchi: "Kancheepuram",
  conjeevaram: "Kancheepuram",
  kovai: "Coimbatore",
  ooty: "Nilgiris",
  nilgiri: "Nilgiris",
  thenilgiris: "Nilgiris",
  arcot: "Ranipet",
  northarcot: "Vellore",
  southarcot: "Cuddalore",
  pondy: "Viluppuram",
};

/**
 * Levenshtein, capped — we only care whether two spellings are close.
 */
function editDistance(a: string, b: string) {
  if (Math.abs(a.length - b.length) > 2) return 3;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i += 1) {
    const row = [i];
    for (let j = 1; j <= b.length; j += 1) {
      row[j] = Math.min(
        prev[j] + 1,
        row[j - 1] + 1,
        prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
    }
    prev = row;
  }
  return prev[b.length];
}

/**
 * Tamil place names have several accepted transliterations, and the
 * Registration Department's spelling is rarely the one people type:
 * Villupuram for Viluppuram, Kanchipuram for Kancheepuram, Thiruvallur for
 * Tiruvallur. Two edits covers those without letting a genuinely different
 * district through — no two district names are that close.
 */
function nearlySame(a: string, b: string) {
  const limit = Math.min(a.length, b.length) >= 9 ? 2 : Math.min(a.length, b.length) >= 6 ? 1 : 0;
  return limit > 0 && editDistance(a, b) <= limit;
}

/**
 * Does what the user typed name one of these districts?
 *
 * Generous on purpose. People write the town rather than the district
 * ("Srirangam", "Hosur"), the colloquial name ("Trichy"), or a spelling the
 * Registration Department does not use ("Villupuram"). A mismatch warning that
 * fires on any of those is noise, and noise gets ignored — including on the
 * occasions it is right.
 */
function districtMatches(candidates: string[], entered: string) {
  const typed = clean(entered);
  if (!typed) return true;

  const aliased = ALIASES[typed];
  if (aliased && candidates.includes(aliased)) return true;

  return candidates.some((name) => {
    const target = clean(name);
    if (target === typed || target.includes(typed) || typed.includes(target)) return true;
    if (nearlySame(target, typed)) return true;

    // Towns, taluk headquarters and the district HQ all stand in for the name.
    const district = DISTRICTS.find((d) => d.name === name);
    if (!district) return false;
    return [district.hq, ...district.sroTowns, ...district.towns].some((town) => {
      const t = clean(town);
      return t === typed || t.includes(typed) || typed.includes(t);
    });
  });
}

/**
 * @param value    what the user typed, digits or otherwise
 * @param district the district selected on the form, if any
 */
export function checkPincode(value: string, district?: string): PincodeCheck {
  const digits = normalise(value);

  if (!digits) return { status: "empty" };

  if (digits.length < 6) {
    return {
      status: "incomplete",
      message: `A PIN code is six digits — you have ${digits.length}.`,
    };
  }
  if (digits.length > 6) {
    return { status: "invalid", message: "A PIN code is six digits, no more." };
  }
  if (digits.startsWith("0")) {
    return { status: "invalid", message: "No PIN code in India starts with a zero." };
  }

  const prefix = digits.slice(0, 3);
  const districts = PREFIX_DISTRICTS[prefix];

  if (!districts) {
    return {
      status: "outside",
      message: digits.startsWith("6")
        ? `${digits} is not a Tamil Nadu PIN code. Ours run 600–643 in the first three digits.`
        : `${digits} is outside Tamil Nadu, and we only deliver within the state.`,
    };
  }

  if (district && district.trim() && !districtMatches(districts, district)) {
    return {
      status: "mismatch",
      districts,
      message: `${digits} is in ${listDistricts(districts)}, but you have entered ${district.trim()}. Check whichever one is wrong.`,
    };
  }

  return { status: "ok", districts };
}

function listDistricts(names: string[]) {
  if (names.length === 1) return names[0];
  if (names.length === 2) return `${names[0]} or ${names[1]}`;
  return `${names.slice(0, -1).join(", ")} or ${names[names.length - 1]}`;
}

/**
 * The district a PIN points at, when the series covers exactly one — used to
 * fill the district field rather than leave it to be typed wrongly.
 */
export function districtFromPincode(value: string): string | null {
  const digits = normalise(value);
  if (digits.length !== 6) return null;
  const districts = PREFIX_DISTRICTS[digits.slice(0, 3)];
  if (!districts || districts.length !== 1) return null;
  const known = DISTRICTS.find((d) => d.name === districts[0]);
  return known ? known.name : null;
}
