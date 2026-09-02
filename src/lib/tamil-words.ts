/**
 * Tamil numerals in words, for the amount that follows every figure in a deed.
 *
 * Tamil compounds are irregular in a way English is not: 20 standing alone is
 * இருபது but 25 is இருபத்தி ஐந்து, 100 is நூறு but 105 is நூற்றி ஐந்து, and
 * 3000 is மூவாயிரம் rather than மூன்று ஆயிரம். So the combining forms are
 * tabulated rather than derived, and the money is grouped the Indian way —
 * கோடி, லட்சம், ஆயிரம் — because that is how the deed reads it out.
 */

const ONES = [
  "", "ஒன்று", "இரண்டு", "மூன்று", "நான்கு", "ஐந்து", "ஆறு", "ஏழு", "எட்டு", "ஒன்பது",
  "பத்து", "பதினொன்று", "பன்னிரண்டு", "பதிமூன்று", "பதினான்கு", "பதினைந்து",
  "பதினாறு", "பதினேழு", "பதினெட்டு", "பத்தொன்பது",
];

/** Standing alone: "இருபது". */
const TENS = ["", "", "இருபது", "முப்பது", "நாற்பது", "ஐம்பது", "அறுபது", "எழுபது", "எண்பது", "தொண்ணூறு"];
/** Followed by a unit: "இருபத்தி ஐந்து". */
const TENS_COMBINING = ["", "", "இருபத்தி", "முப்பத்தி", "நாற்பத்தி", "ஐம்பத்தி", "அறுபத்தி", "எழுபத்தி", "எண்பத்தி", "தொண்ணூற்றி"];

const HUNDREDS = ["", "நூறு", "இருநூறு", "முந்நூறு", "நானூறு", "ஐந்நூறு", "அறுநூறு", "எழுநூறு", "எண்ணூறு", "தொள்ளாயிரம்"];
const HUNDREDS_COMBINING = ["", "நூற்றி", "இருநூற்றி", "முந்நூற்றி", "நானூற்றி", "ஐந்நூற்றி", "அறுநூற்றி", "எழுநூற்றி", "எண்ணூற்றி", "தொள்ளாயிரத்தி"];

/** 1000-9000 standing alone, then the form used when something follows. */
const THOUSANDS = ["", "ஆயிரம்", "இரண்டாயிரம்", "மூவாயிரம்", "நான்காயிரம்", "ஐந்தாயிரம்", "ஆறாயிரம்", "ஏழாயிரம்", "எட்டாயிரம்", "ஒன்பதாயிரம்"];
const THOUSANDS_COMBINING = ["", "ஆயிரத்தி", "இரண்டாயிரத்தி", "மூவாயிரத்தி", "நான்காயிரத்தி", "ஐந்தாயிரத்தி", "ஆறாயிரத்தி", "ஏழாயிரத்தி", "எட்டாயிரத்தி", "ஒன்பதாயிரத்தி"];

/** 1-999, with `more` set when further words follow and the combining form is needed. */
function underThousand(n: number, more: boolean): string {
  if (n === 0) return "";
  const h = Math.floor(n / 100);
  const rest = n % 100;
  const parts: string[] = [];
  if (h) parts.push(rest || more ? HUNDREDS_COMBINING[h] : HUNDREDS[h]);
  if (rest) {
    if (rest < 20) parts.push(ONES[rest]);
    else {
      const t = Math.floor(rest / 10);
      const u = rest % 10;
      parts.push(u ? TENS_COMBINING[t] : TENS[t]);
      if (u) parts.push(ONES[u]);
    }
  }
  return parts.join(" ");
}

/** 1-99,999, where the thousands themselves have irregular forms. */
function underLakh(n: number, more: boolean): string {
  const th = Math.floor(n / 1000);
  const rest = n % 1000;
  if (!th) return underThousand(rest, more);
  const parts: string[] = [];
  if (th < 10) {
    parts.push(rest || more ? THOUSANDS_COMBINING[th] : THOUSANDS[th]);
  } else {
    // 10,000 and above: "பதினைந்து ஆயிரம்", built from the count of thousands.
    parts.push(underThousand(th, true));
    parts.push(rest || more ? "ஆயிரத்தி" : "ஆயிரம்");
  }
  if (rest) parts.push(underThousand(rest, more));
  return parts.join(" ");
}

/**
 * The whole amount in words, without the word "ரூபாய்" — the deeds already
 * print that themselves, as "(ரூபாய் ... மட்டும்)".
 */
export function tamilNumberWords(value: number): string {
  const n = Math.floor(Math.abs(value));
  if (!Number.isFinite(n)) return "";
  if (n === 0) return "பூஜ்யம்";

  const crore = Math.floor(n / 10000000);
  const lakh = Math.floor((n % 10000000) / 100000);
  const rest = n % 100000;

  const parts: string[] = [];
  if (crore) {
    parts.push(underLakh(crore, true));
    parts.push(lakh || rest ? "கோடியே" : "கோடி");
  }
  if (lakh) {
    parts.push(underThousand(lakh, true));
    parts.push(rest ? "லட்சத்து" : "லட்சம்");
  }
  if (rest) parts.push(underLakh(rest, false));
  return parts.filter(Boolean).join(" ");
}

const MONTHS = [
  "ஜனவரி", "பிப்ரவரி", "மார்ச்", "ஏப்ரல்", "மே", "ஜூன்",
  "ஜூலை", "ஆகஸ்ட்", "செப்டம்பர்", "அக்டோபர்", "நவம்பர்", "டிசம்பர்",
];

export function tamilMonth(date: Date): string {
  return MONTHS[date.getMonth()] ?? "";
}

/** The deeds set out a date as year, month and day in three separate blanks. */
export function tamilDateParts(date: Date) {
  return {
    year: String(date.getFullYear()),
    month: tamilMonth(date),
    day: String(date.getDate()),
  };
}
