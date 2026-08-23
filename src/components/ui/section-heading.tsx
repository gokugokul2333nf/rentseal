import { cn } from "@/lib/utils";
import { Eyebrow } from "./card";
import { Reveal } from "./motion";

export function SectionHeading({
  eyebrow,
  title,
  body,
  align = "center",
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
        "max-w-2xl",
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
        <h2 className="mt-5 text-[clamp(1.85rem,4.2vw,2.85rem)] leading-[1.12] font-extrabold text-navy-950">
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
