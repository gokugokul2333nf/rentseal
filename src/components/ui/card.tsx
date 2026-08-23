import { cn } from "@/lib/utils";

export function Card({
  className,
  interactive,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { interactive?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-line bg-white shadow-soft",
        interactive &&
          "transition-[box-shadow,border-color,transform] duration-300 hover:-translate-y-1 hover:border-navy-200 hover:shadow-lift",
        className,
      )}
      {...props}
    />
  );
}

export function CardBody({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-6 sm:p-7", className)} {...props} />;
}

export function Badge({
  className,
  tone = "neutral",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & {
  tone?: "neutral" | "brand" | "emerald" | "amber" | "rose" | "dark" | "violet";
}) {
  const tones = {
    neutral: "bg-navy-100 text-navy-700 border-navy-200/70",
    brand: "bg-brand-50 text-brand-700 border-brand-200",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    rose: "bg-rose-50 text-rose-700 border-rose-200",
    violet: "bg-violet-50 text-violet-700 border-violet-200",
    dark: "bg-navy-950 text-white border-navy-950",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11.5px] font-semibold leading-none tracking-tight",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}

/** Small pill used above section headings. */
export function Eyebrow({
  className,
  children,
  icon: Icon,
}: {
  className?: string;
  children: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-brand-200/80 bg-brand-50/70 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-brand-700 uppercase",
        className,
      )}
    >
      {Icon ? <Icon className="size-3.5" /> : null}
      {children}
    </span>
  );
}
