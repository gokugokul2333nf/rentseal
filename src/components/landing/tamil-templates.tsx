import Link from "next/link";
import { ArrowRight, Languages } from "lucide-react";
import { TAMIL_TEMPLATES, TAMIL_TEMPLATE_IDS } from "@/lib/tamil-templates";
import { Badge } from "@/components/ui/card";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/motion";
import { SectionHeading } from "@/components/ui/section-heading";

/**
 * The Tamil deeds, drafted through the same builder as the English templates.
 *
 * These are the office's own Tamil documents, not the English ones translated,
 * so they are held verbatim and keep their own numbering. What the form can
 * answer — the parties, the dates, the rent, the advance, the addresses — is
 * substituted into the Tamil text; the rest of the blanks are written in at
 * the counter, or edited in the builder before the deed is sent.
 */
export function TamilTemplates({ heading = true }: { heading?: boolean } = {}) {
  return (
    <section id="tamil-templates" className="section border-t border-line bg-canvas">
      <div className="container-page">
        {heading ? (
          <SectionHeading
            eyebrow="தமிழ் ஒப்பந்தங்கள்"
            icon={Languages}
            title={`${TAMIL_TEMPLATE_IDS.length} Tamil deeds, drafted from your answers`}
            body="The documents the counter has always used — rent, lease, loan, mortgage, sale, indemnity, affidavit and no-objection. Drafted from the same form as the English ones: your answers land inside the Tamil text, and both parties sign every page."
          />
        ) : null}

        <Stagger className="mt-11 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" amount={0.05}>
          {TAMIL_TEMPLATE_IDS.map((id) => {
            const t = TAMIL_TEMPLATES[id];
            return (
              <StaggerItem key={id} className="h-full">
                <Link
                  href={`/create/${id}`}
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
                    Draft this
                    <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </Link>
              </StaggerItem>
            );
          })}
        </Stagger>

        <Reveal delay={0.15}>
          <p className="mt-8 text-[13px] leading-relaxed text-navy-500">
            Whatever the form does not ask about stays as a blank rule for the counter, and any
            paragraph can be reworded before the deed is sent. Print onto non-judicial stamp paper
            of the right value — buying too little is what gets an agreement refused.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
