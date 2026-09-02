import { ArrowDownToLine, Languages } from "lucide-react";
import { TAMIL_TEMPLATES, TAMIL_TEMPLATE_IDS } from "@/lib/tamil-templates";
import { Badge } from "@/components/ui/card";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/motion";
import { SectionHeading } from "@/components/ui/section-heading";

/**
 * The Tamil deeds, offered as blank documents rather than through the builder.
 *
 * They work differently from the English templates on purpose. The office has
 * always filled these in by hand at the counter, and their blanks sit inside
 * Tamil sentences rather than in fields a form could ask about — so the useful
 * thing is the deed itself, printed and ready for the stamp paper, not a
 * questionnaire in front of it.
 */
export function TamilTemplates({ heading = true }: { heading?: boolean } = {}) {
  return (
    <section id="tamil-templates" className="section border-t border-line bg-canvas">
      <div className="container-page">
        {heading ? (
          <SectionHeading
            eyebrow="தமிழ் ஒப்பந்தங்கள்"
            icon={Languages}
            title={`${TAMIL_TEMPLATE_IDS.length} Tamil deeds, ready to print`}
            body="The documents the counter has always used — rent, lease, loan, mortgage, sale, indemnity, affidavit and no-objection. Each opens as a blank PDF with both parties signing every page and the pages numbered."
          />
        ) : null}

        <Stagger className="mt-11 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" amount={0.05}>
          {TAMIL_TEMPLATE_IDS.map((id) => {
            const t = TAMIL_TEMPLATES[id];
            return (
              <StaggerItem key={id} className="h-full">
                <a
                  href={`/api/tamil-deed?template=${id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-full flex-col rounded-2xl border border-line bg-white p-5 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-brand-300 hover:shadow-lift"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-display text-[15.5px] leading-snug font-bold text-navy-950">
                      {t.nameTa}
                    </h3>
                    <Badge>{t.body.length} paras</Badge>
                  </div>
                  <p className="mt-1.5 flex-1 text-[13px] leading-relaxed text-navy-500">
                    {t.nameEn}
                  </p>
                  <p className="mt-3 text-[12px] text-navy-400">
                    {t.roleB ? `${t.roleA} · ${t.roleB}` : t.roleA}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 border-t border-line pt-4 text-[13px] font-semibold text-brand-700">
                    <ArrowDownToLine className="size-3.5" />
                    Open the blank deed
                  </span>
                </a>
              </StaggerItem>
            );
          })}
        </Stagger>

        <Reveal delay={0.15}>
          <p className="mt-8 text-[13px] leading-relaxed text-navy-500">
            Every blank is filled in at the counter. Print onto non-judicial stamp paper of the
            right value — the deed does not create the stamp duty, and buying too little is what
            gets an agreement refused.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
