/**
 * Phonetic Tamil typing — "thurairaj" becomes "துரைராஜ்".
 *
 * Most people in Tamil Nadu type Tamil this way rather than with a Tamil
 * keyboard layout, so the form accepts romanised input and converts it as they
 * type. The conventions are the ones Google Input and Azhagi established, and
 * they are what a user will already have in their fingers:
 *
 *   t/d → ட (retroflex)     th/dh → த
 *   l → ல                    L/zh → ள / ழ
 *   r → ர                    R → ற
 *   s → ச                    S/sh → ஸ / ஷ
 *   ee → ஈ                   E → ஏ

 * Doubled letters double, rather than mapping to a different letter: "nn" is
 * ன்ன, not ன. That is what makes "chennai" come out as சென்னை.
 *   n → ந at the start of a word, ன inside it
 *
 * A consonant with no vowel after it takes the pulli, which is what makes
 * doubled letters come out right on their own: "chennai" is ச + ெ, then ன with
 * a pulli because another ன follows, then னை — சென்னை.
 */

/** Independent vowels, and the sign each one becomes after a consonant. */
const VOWELS: Array<[string, string, string]> = [
  ["ai", "ஐ", "ை"],
  ["au", "ஔ", "ௌ"],
  ["ou", "ஔ", "ௌ"],
  ["aa", "ஆ", "ா"],
  ["ii", "ஈ", "ீ"],
  ["ee", "ஈ", "ீ"],
  ["uu", "ஊ", "ூ"],
  ["oo", "ஓ", "ோ"],
  ["A", "ஆ", "ா"],
  ["I", "ஈ", "ீ"],
  ["E", "ஏ", "ே"],
  ["U", "ஊ", "ூ"],
  ["O", "ஓ", "ோ"],
  ["a", "அ", ""],
  ["i", "இ", "ி"],
  ["u", "உ", "ு"],
  ["e", "எ", "ெ"],
  ["o", "ஒ", "ொ"],
];

/** Longest first, so "th" wins over "t" and "ksh" over "k". */
const CONSONANTS: Array<[string, string]> = [
  ["ksh", "க்ஷ"],
  ["zh", "ழ"],
  ["ng", "ங"],
  ["nj", "ஞ"],
  ["gn", "ஞ"],
  ["ch", "ச"],
  ["sh", "ஷ"],
  ["th", "த"],
  ["dh", "த"],
  ["k", "க"],
  ["g", "க"],
  ["S", "ஸ"],
  ["s", "ச"],
  ["c", "ச"],
  ["j", "ஜ"],
  ["t", "ட"],
  ["d", "ட"],
  ["N", "ண"],
  ["T", "ட"],
  ["D", "ட"],
  ["n", "ந"],
  ["p", "ப"],
  ["b", "ப"],
  ["m", "ம"],
  ["y", "ய"],
  ["r", "ர"],
  ["R", "ற"],
  ["l", "ல"],
  ["L", "ள"],
  ["v", "வ"],
  ["w", "வ"],
  ["h", "ஹ"],
  ["f", "ஃப"],
  ["q", "க"],
  ["x", "க்ஸ"],
  ["z", "ஸ"],
];

const PULLI = "்";
/** Inside a word this is ன, not ந — "chennai" is சென்னை. */
const NA_MEDIAL = "ன";

function matchAt(src: string, i: number, table: Array<[string, ...string[]]>) {
  for (const row of table) {
    if (src.startsWith(row[0], i)) return row;
  }
  return null;
}

/**
 * Converts romanised text to Tamil. Characters that are already Tamil, and
 * anything that is not a letter, pass through untouched — so a pasted Tamil
 * name survives, and so do door numbers and punctuation.
 */
export function transliterate(input: string): string {
  let out = "";
  let i = 0;
  // True when the previous thing written was a consonant still carrying its
  // pulli, and so is waiting to see whether a vowel follows.
  let pending = false;
  // True at the start of a word, where "n" is ந rather than ன.
  let wordStart = true;

  while (i < input.length) {
    const ch = input[i];

    if (!/[A-Za-z]/.test(ch)) {
      out += ch;
      pending = false;
      wordStart = !/[஀-௿]/.test(ch);
      i += 1;
      continue;
    }

    const vowel = matchAt(input, i, VOWELS as Array<[string, ...string[]]>);
    if (vowel) {
      const [roman, independent, sign] = vowel as [string, string, string];
      if (pending) {
        // Replace the pulli with this vowel's sign.
        out = out.slice(0, -PULLI.length) + sign;
        pending = false;
      } else {
        out += independent;
      }
      wordStart = false;
      i += roman.length;
      continue;
    }

    const cons = matchAt(input, i, CONSONANTS as Array<[string, ...string[]]>);
    if (cons) {
      const [roman, tamil] = cons as [string, string];
      const letter = roman === "n" && !wordStart ? NA_MEDIAL : tamil;
      out += letter + PULLI;
      pending = true;
      wordStart = false;
      i += roman.length;
      continue;
    }

    out += ch;
    i += 1;
  }
  return out;
}

/** Does the text already contain Tamil? Used to leave pasted Tamil alone. */
export function hasTamil(value: string) {
  return /[஀-௿]/.test(value);
}
