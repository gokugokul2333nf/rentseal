import Link from "next/link";
import { cn } from "@/lib/utils";

/** The mark: a document corner folded inside a notarial seal ring. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={cn("size-9", className)} aria-hidden="true">
      <defs>
        <linearGradient id="rs-mark" x1="4" y1="2" x2="36" y2="38" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2563EB" />
          <stop offset="0.55" stopColor="#1D4ED8" />
          <stop offset="1" stopColor="#0F172A" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="11.5" fill="url(#rs-mark)" />
      {/* seal ring */}
      <circle cx="20" cy="20" r="12.5" stroke="white" strokeOpacity="0.28" strokeWidth="1.2" />
      <circle
        cx="20"
        cy="20"
        r="12.5"
        stroke="white"
        strokeOpacity="0.55"
        strokeWidth="1.2"
        strokeDasharray="2.2 3.4"
      />
      {/* document with folded corner */}
      <path
        d="M15 13.2h6.4l3.9 3.9v9.7a1.2 1.2 0 0 1-1.2 1.2H15a1.2 1.2 0 0 1-1.2-1.2V14.4A1.2 1.2 0 0 1 15 13.2Z"
        fill="white"
      />
      <path d="M21.4 13.2v3a.9.9 0 0 0 .9.9h3l-3.9-3.9Z" fill="white" fillOpacity="0.55" />
      {/* check */}
      <path
        d="m16.8 21.6 2 2 4-4.3"
        stroke="#2563EB"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Logo({
  className,
  href = "/",
  inverted,
  showTag,
}: {
  className?: string;
  href?: string;
  inverted?: boolean;
  showTag?: boolean;
}) {
  return (
    <Link href={href} className={cn("group inline-flex items-center gap-2.5", className)}>
      <LogoMark className="size-9 transition-transform duration-500 group-hover:rotate-[-6deg]" />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-display text-[19px] font-bold tracking-[-0.03em]",
            inverted ? "text-white" : "text-navy-950",
          )}
        >
          Rent<span className={inverted ? "text-brand-300" : "text-brand-600"}>Seal</span>
        </span>
        {showTag ? (
          <span
            className={cn(
              "mt-1 text-[9.5px] font-semibold tracking-[0.16em] uppercase",
              inverted ? "text-white/45" : "text-navy-400",
            )}
          >
            Tamil Nadu
          </span>
        ) : null}
      </span>
    </Link>
  );
}
