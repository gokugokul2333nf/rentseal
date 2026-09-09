import { cn } from "@/lib/utils";

/**
 * A picture of what actually arrives.
 *
 * People were choosing "Any value — e-Stamp" expecting a sheet of paper in an
 * envelope, because in a list of text options an e-Stamp certificate and a
 * ₹100 non-judicial sheet look like the same kind of thing. They are not: one
 * is physical stock a rider carries to your door, the other is a PDF that
 * arrives by email in minutes. So the two are drawn differently, and the
 * difference is the point of the drawing.
 *
 * These are representations, not scans — deliberately. A scan of a real sheet
 * carries a real serial number, and putting one on a marketing page is
 * publishing an identifiable government instrument that belongs to whoever
 * bought it.
 */
export function StampSheet({
  value,
  label,
  className,
}: {
  /** Face value. 0 draws the e-Stamp certificate instead. */
  value: number;
  label: string;
  className?: string;
}) {
  if (value === 0) return <EStampCertificate className={className} />;

  return (
    <svg
      viewBox="0 0 132 84"
      role="img"
      aria-label={`${label} non-judicial stamp paper`}
      className={cn("h-auto w-full", className)}
    >
      <rect width="132" height="84" rx="2" fill="#fdf2f5" />
      {/* The guilloche border the real sheet carries, suggested rather than copied. */}
      <rect x="2.5" y="2.5" width="127" height="79" rx="1.5" fill="none" stroke="#c2185b" strokeWidth="1.2" />
      <rect x="5" y="5" width="122" height="74" rx="1" fill="none" stroke="#e91e63" strokeWidth="0.4" strokeDasharray="1.5 1" opacity="0.7" />

      <text x="66" y="15" textAnchor="middle" fill="#ad1457" fontSize="6" fontWeight="700" letterSpacing="0.3">
        INDIA NON JUDICIAL
      </text>
      <line x1="18" y1="18.5" x2="114" y2="18.5" stroke="#e91e63" strokeWidth="0.4" opacity="0.6" />

      {/* Emblem: a plinth and three suggested lions. Not the State Emblem itself. */}
      <g fill="#ad1457" opacity="0.85">
        <ellipse cx="66" cy="33" rx="4.5" ry="1.2" />
        <path d="M62 32.5c0-3 1.8-5 4-5s4 2 4 5z" />
        <circle cx="63.2" cy="28.4" r="1.5" />
        <circle cx="66" cy="27.6" r="1.7" />
        <circle cx="68.8" cy="28.4" r="1.5" />
        <rect x="64.6" y="34.4" width="2.8" height="4" rx="0.4" />
      </g>

      <text x="66" y="52" textAnchor="middle" fill="#880e4f" fontSize="15" fontWeight="800" letterSpacing="-0.2">
        ₹{value.toLocaleString("en-IN")}
      </text>
      <text x="66" y="61" textAnchor="middle" fill="#ad1457" fontSize="4.6" fontWeight="600" letterSpacing="0.4">
        NON-JUDICIAL STAMP PAPER
      </text>

      <line x1="18" y1="66" x2="114" y2="66" stroke="#e91e63" strokeWidth="0.4" opacity="0.6" />
      <text x="66" y="73.5" textAnchor="middle" fill="#c2185b" fontSize="4.4" fontWeight="700" letterSpacing="0.5">
        TAMIL NADU
      </text>
    </svg>
  );
}

/** The e-Stamp: a certificate, not a sheet, and drawn so it reads that way. */
function EStampCertificate({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 132 84"
      role="img"
      aria-label="e-Stamp certificate, issued digitally"
      className={cn("h-auto w-full", className)}
    >
      <rect width="132" height="84" rx="2" fill="#f0f7ff" />
      <rect x="2.5" y="2.5" width="127" height="79" rx="1.5" fill="none" stroke="#1e5fa8" strokeWidth="1.2" />

      <text x="66" y="15" textAnchor="middle" fill="#1e5fa8" fontSize="6" fontWeight="700" letterSpacing="0.3">
        e-STAMP CERTIFICATE
      </text>
      <line x1="18" y1="18.5" x2="114" y2="18.5" stroke="#1e5fa8" strokeWidth="0.4" opacity="0.6" />

      {/* A QR block — the thing that says "this is verified from a screen". */}
      <g fill="#1e5fa8">
        <rect x="22" y="26" width="24" height="24" rx="1" fill="none" stroke="#1e5fa8" strokeWidth="1" />
        <rect x="25" y="29" width="6" height="6" rx="0.5" />
        <rect x="37" y="29" width="6" height="6" rx="0.5" />
        <rect x="25" y="41" width="6" height="6" rx="0.5" />
        <rect x="34" y="38" width="3" height="3" />
        <rect x="39" y="41" width="3" height="3" />
        <rect x="34" y="45" width="3" height="3" />
        <rect x="42" y="45" width="2.5" height="2.5" />
      </g>

      {[0, 1, 2].map((i) => (
        <rect key={i} x="54" y={28 + i * 6} width={i === 2 ? 32 : 52} height="2.6" rx="1.3" fill="#1e5fa8" opacity="0.3" />
      ))}
      <text x="54" y="50" fill="#1e5fa8" fontSize="5.4" fontWeight="800">
        Any value
      </text>

      <line x1="18" y1="58" x2="114" y2="58" stroke="#1e5fa8" strokeWidth="0.4" opacity="0.6" />
      <text x="66" y="66" textAnchor="middle" fill="#1e5fa8" fontSize="4.6" fontWeight="700" letterSpacing="0.3">
        EMAILED, NOT DELIVERED
      </text>
      <text x="66" y="74" textAnchor="middle" fill="#4a7fc1" fontSize="4" letterSpacing="0.2">
        Issued for the exact duty payable
      </text>
    </svg>
  );
}
