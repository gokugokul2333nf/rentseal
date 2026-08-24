import { ArrowRight, Clock3, Route } from "lucide-react";
import { HOW_IT_WORKS, LEAD_ANCHOR } from "@/lib/site";
import { ButtonLink } from "@/components/ui/button";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/motion";
import { SectionHeading } from "@/components/ui/section-heading";

export function HowItWorks() {
  return (
    <section id="how-it-works" className="section relative overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-dots opacity-40" />

      <div className="container-page">
        <SectionHeading
          eyebrow="How it works"
          icon={Route}
          title={
            <>
              Four steps. Ten minutes.
              <br className="hidden sm:block" /> Nobody leaves the house.
            </>
          }
          body="The whole process is designed like booking a flight — answer what you know, we handle the paperwork, and the finished document lands in your inbox."
        />

        <div className="relative mt-16">
          {/* connecting rail */}
          <div
            aria-hidden="true"
            className="absolute top-[38px] right-[12%] left-[12%] hidden h-px lg:block"
          >
            <div className="h-full w-full bg-[linear-gradient(90deg,transparent,var(--color-line)_12%,var(--color-line)_88%,transparent)]" />
          </div>

          <Stagger className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {HOW_IT_WORKS.map((step) => (
              <StaggerItem key={step.step} className="relative">
                <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
                  <span className="relative z-10 grid size-[76px] place-items-center rounded-2xl border border-line bg-white font-display text-[26px] font-bold text-navy-950 shadow-card">
                    {step.step}
                    <span className="absolute -right-1.5 -bottom-1.5 flex items-center gap-1 rounded-full bg-brand-600 px-2 py-0.5 text-[9.5px] font-bold text-white shadow-sm">
                      <Clock3 className="size-2.5" />
                      {step.time}
                    </span>
                  </span>

                  <h3 className="mt-6 font-display text-[19px] font-bold text-navy-950">
                    {step.title}
                  </h3>
                  <p className="mt-2.5 max-w-xs text-[14.5px] leading-[1.7] text-navy-500 lg:max-w-none">
                    {step.body}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>

        <Reveal delay={0.2} className="mt-10 flex justify-center">
          <ButtonLink href={LEAD_ANCHOR} size="lg" className="group">
            Start with a free call back
            <ArrowRight className="size-[18px] transition-transform duration-300 group-hover:translate-x-1" />
          </ButtonLink>
        </Reveal>
      </div>
    </section>
  );
}
