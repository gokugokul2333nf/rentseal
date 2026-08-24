import { cn } from "@/lib/utils";
import { Eyebrow } from "./card";
import { Reveal } from "./motion";

/**
 * Default alignment is left.
 *
 * Every section previously ran centred eyebrow, centred heading, centred
 * paragraph, ten times down the page. Centring everything is what a template
 * does; editorial layouts anchor to a left margin and centre only when there is
 * a reason to.
 */
export function SectionHeading({
  eyebrow,
  title,
  body,
  align = "left",
  className,
  icon,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  body?: React.ReactNode;
  align?: "center" | "left";
  className?: string;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div
      className={cn(
        align === "center" ? "max-w-2xl" : "max-w-3xl",
        align === "center" ? "mx-auto text-center" : "text-left",
        className,
      )}
    >
      {eyebrow ? (
        <Reveal>
          <Eyebrow icon={icon}>{eyebrow}</Eyebrow>
        </Reveal>
      ) : null}
      <Reveal delay={0.06}>
        <h2 className="mt-4 text-[clamp(1.8rem,3.8vw,2.6rem)] leading-[1.15] font-bold text-navy-950">
          {title}
        </h2>
      </Reveal>
      {body ? (
        <Reveal delay={0.12}>
          <p
            className={cn(
              "mt-4 text-[16.5px] leading-[1.7] text-navy-500",
              align === "center" && "mx-auto",
            )}
          >
            {body}
          </p>
        </Reveal>
      ) : null}
    </div>
  );
}
