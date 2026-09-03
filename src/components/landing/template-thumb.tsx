import type { AgreementTemplate } from "@/lib/templates";

/**
 * The picture on a template card.
 *
 * A catalogue of seventy-one documents that are all "a page of text" is hard to
 * read as a grid of words alone — every card is the same shape and the eye has
 * nothing to land on. So each card carries a drawing of the document itself: a
 * sheet on a tinted ground, ruled the way that instrument is actually laid out,
 * with the stamp seal a Tamil Nadu deed carries in the corner.
 *
 * It is drawn rather than photographed. A stock photograph of "a contract"
 * would be the same picture on all seventy-one cards, would say nothing true
 * about the document underneath it, and would cost more to load than the page
 * it decorates. This is a few hundred bytes of inline SVG, sharp at any size,
 * and it takes the category's colour so the six groups read apart at a glance.
 *
 * The ruling varies per template but never randomly: line lengths come from a
 * hash of the template's id, so a card looks the same on the server as it does
 * in the browser and the same on every visit.
 */

type Tone = { from: string; to: string; accent: string; seal: string };

/**
 * One palette per category, matching the badge each group is labelled with.
 * Values are literals rather than Tailwind classes because they are used as SVG
 * fill attributes, which the class scanner cannot see.
 */
const TONES: Record<AgreementTemplate["category"], Tone> = {
  Residential: { from: "#eff6ff", to: "#dbeafe", accent: "#2563eb", seal: "#1d4ed8" },
  Commercial: { from: "#f8fafc", to: "#e2e8f0", accent: "#0f172a", seal: "#394354" },
  "Lease deed": { from: "#ecfdf5", to: "#d1fae5", accent: "#059669", seal: "#047857" },
  "Leave & licence": { from: "#f5f3ff", to: "#ede9fe", accent: "#7c3aed", seal: "#6d28d9" },
  Sale: { from: "#fff7ed", to: "#ffedd5", accent: "#ea580c", seal: "#c2410c" },
  "Business contract": { from: "#ecfeff", to: "#cffafe", accent: "#0891b2", seal: "#0e7490" },
  "Deeds & undertakings": { from: "#faf5ff", to: "#f3e8ff", accent: "#9333ea", seal: "#7e22ce" },
  Affidavits: { from: "#fffbeb", to: "#fef3c7", accent: "#d97706", seal: "#b45309" },
  "Tamil — தமிழ்": { from: "#fef2f2", to: "#fee2e2", accent: "#e11d48", seal: "#be123c" },
};

/** FNV-1a. Small, stable, and the same on the server as in the browser. */
function hash(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/**
 * The body rules of the drawn page.
 *
 * Widths are drawn from the hash so no two documents are ruled alike, and a
 * short line is forced every few rows — a page of uniformly full lines reads as
 * a wireframe placeholder rather than as prose.
 */
function rules(seed: number, count: number): number[] {
  const out: number[] = [];
  let h = seed;
  for (let i = 0; i < count; i += 1) {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    const paragraphEnd = i % 4 === 3;
    out.push(paragraphEnd ? 34 + ((h >>> 8) % 26) : 74 + ((h >>> 8) % 20));
  }
  return out;
}

export function TemplateThumb({
  template,
  className,
}: {
  template: AgreementTemplate;
  className?: string;
}) {
  const tone = TONES[template.category];
  const seed = hash(template.id);
  const lines = rules(seed, 9);
  const id = `t-${template.id}`;

  return (
    <svg
      viewBox="0 0 240 160"
      className={className}
      // Decoration. The card's heading already names the document, and a second
      // description of it here would only be read out twice.
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={tone.from} />
          <stop offset="100%" stopColor={tone.to} />
        </linearGradient>
      </defs>

      <rect width="240" height="160" fill={`url(#${id}-bg)`} />

      {/* The faint ruled ground the rest of the site uses for its hero. */}
      <g stroke={tone.accent} strokeOpacity="0.07" strokeWidth="1">
        {[40, 80, 120, 160, 200].map((x) => (
          <line key={x} x1={x} y1="0" x2={x} y2="160" />
        ))}
        {[40, 80, 120].map((y) => (
          <line key={y} x1="0" y1={y} x2="240" y2={y} />
        ))}
      </g>

      {/* A second sheet behind, so the stack reads as a document not a card. */}
      <rect
        x="82"
        y="26"
        width="104"
        height="128"
        rx="4"
        fill="#ffffff"
        fillOpacity="0.55"
        transform="rotate(-5 134 90)"
      />

      {/* The sheet itself, ruled as the deed is laid out. */}
      <g transform="translate(68 22)">
        <rect width="104" height="132" rx="4" fill="#ffffff" />
        <rect
          width="104"
          height="132"
          rx="4"
          fill="none"
          stroke={tone.accent}
          strokeOpacity="0.18"
        />

        {/* Title block: the deed's heading, centred and underscored. */}
        <rect x="26" y="13" width="52" height="5" rx="2.5" fill={tone.accent} />
        <rect x="34" y="22" width="36" height="3" rx="1.5" fill={tone.accent} fillOpacity="0.35" />

        <g fill="#0f172a" fillOpacity="0.16">
          {lines.map((width, i) => (
            <rect
              key={i}
              x="13"
              y={35 + i * 8}
              width={(width / 100) * 78}
              height="3"
              rx="1.5"
            />
          ))}
        </g>

        {/* Where both parties sign — on every page, as the deeds require. */}
        <g fill="#0f172a" fillOpacity="0.28">
          <rect x="13" y="115" width="30" height="2.5" rx="1.25" />
          <rect x="61" y="115" width="30" height="2.5" rx="1.25" />
        </g>
        <g fill="#0f172a" fillOpacity="0.13">
          <rect x="13" y="121" width="20" height="2" rx="1" />
          <rect x="61" y="121" width="20" height="2" rx="1" />
        </g>
      </g>

      {/* The stamp. A deed that is not stamped is the one that gets refused. */}
      <g transform="translate(178 112)">
        <circle r="19" fill="#ffffff" fillOpacity="0.9" />
        <circle r="19" fill="none" stroke={tone.seal} strokeOpacity="0.5" strokeWidth="1.5" />
        <circle r="14" fill="none" stroke={tone.seal} strokeOpacity="0.3" strokeWidth="1" />
        <text
          y="4.5"
          textAnchor="middle"
          fontSize="13"
          fontWeight="700"
          fill={tone.seal}
          fillOpacity="0.75"
          fontFamily="Georgia, 'Times New Roman', serif"
        >
          ₹
        </text>
      </g>
    </svg>
  );
}
