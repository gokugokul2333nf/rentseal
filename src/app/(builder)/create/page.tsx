import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, Clock3, FileText, ShieldCheck, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/card";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/motion";
import { TEMPLATE_SPECS } from "@/lib/agreement-templates";
import { getTemplatesByCategory, TEMPLATES } from "@/lib/templates";
import type { AgreementTemplate } from "@/lib/templates";

export const metadata: Metadata = {
  title: "Choose Your Agreement — All Templates",
  description: `Pick from ${TEMPLATES.length} Tamil Nadu agreement templates — residential, commercial, lease deeds and leave-and-licence. Every one is drafted from the signed-off wording, with its own clauses. Free until you pay.`,
  alternates: { canonical: "/create" },
  // The self-serve builder is built but switched off — see the README. These
  // routes still render, so keep them out of the index until it goes live.
  robots: { index: false, follow: false },
};

const CATEGORY_TONE: Record<
  AgreementTemplate["category"],
  "brand" | "emerald" | "violet" | "amber"
> = {
  Residential: "brand",
  Commercial: "emerald",
  "Lease deed": "violet",
  "Leave & licence": "amber",
};

const CATEGORY_BLURB: Record<AgreementTemplate["category"], string> = {
  Residential: "Somewhere to live — let on monthly rent, usually for eleven months.",
  Commercial: "Trade premises. Longer terms, and the business clauses come with them.",
  "Lease deed": "Twelve months and over, registrable, with the strongest evidentiary position.",
  "Leave & licence": "Permission to occupy without granting a tenancy, so possession comes back cleanly.",
};

/**
 * Every template we can draw, by name.
 *
 * This page used to offer four cards — the four instruments — which meant a
 * warehouse and a shop were the same click, and the twenty-four templates the
 * office actually signed off were nowhere the customer could see them. Each
 * card now links to its own drafting URL, so picking "Warehouse / Godown" opens
 * the godown deed with its own clauses and its own thirty-six month term
 * already filled in.
 */
export default function CreatePage() {
  const groups = getTemplatesByCategory();

  return (
    <div className="relative overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-mesh opacity-70" />
        <div className="absolute inset-0 bg-grid" />
      </div>

      <div className="container-page py-16 md:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <Badge tone="brand" className="px-3.5 py-1.5">
              <Sparkles className="size-3.5" />
              {TEMPLATES.length} templates — no signup needed
            </Badge>
          </Reveal>
          <Reveal delay={0.06}>
            <h1 className="mt-6 text-[clamp(2rem,5vw,3.15rem)] leading-[1.1] font-bold tracking-[-0.03em] text-navy-950">
              What kind of agreement do you need?
            </h1>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-5 text-[17px] leading-[1.7] text-navy-600">
              Pick the one closest to your situation and its clauses, its term and its wording come
              with it. If you get it wrong you can switch at any point — we keep the parties and
              the address and re-draft the rest.
            </p>
          </Reveal>
        </div>

        <div className="mx-auto mt-14 max-w-6xl space-y-14">
          {groups.map(({ category, templates }) => (
            <div key={category}>
              <div className="flex flex-wrap items-center gap-3">
                <Badge tone={CATEGORY_TONE[category]}>{category}</Badge>
                <span className="text-[13px] font-medium text-navy-500">
                  {templates.length} template{templates.length === 1 ? "" : "s"}
                </span>
                <span aria-hidden="true" className="hidden h-px flex-1 bg-line sm:block" />
              </div>
              <p className="mt-2 max-w-2xl text-[13.5px] leading-relaxed text-navy-500">
                {CATEGORY_BLURB[category]}
              </p>

              <Stagger className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" amount={0.05}>
                {templates.map((template) => {
                  const spec = TEMPLATE_SPECS[template.id];
                  return (
                    <StaggerItem key={template.id} className="h-full">
                      <Link
                        href={`/create/${template.id}`}
                        className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white p-5 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-brand-500 hover:shadow-lift"
                      >
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute -top-20 -right-16 size-44 rounded-full bg-brand-500/[0.07] opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
                        />
                        <div className="relative flex items-start justify-between gap-3">
                          <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-navy-950 text-white transition-colors duration-300 group-hover:bg-brand-600">
                            <FileText className="size-4.5" />
                          </span>
                          {template.popular ? <Badge tone="dark">Most popular</Badge> : null}
                        </div>

                        <h2 className="relative mt-4 font-display text-[15.5px] leading-snug font-bold text-navy-950">
                          {template.name}
                        </h2>
                        <p className="relative mt-1.5 flex-1 text-[13px] leading-[1.65] text-navy-500">
                          {template.description}
                        </p>

                        {spec ? (
                          <p className="relative mt-3 text-[12px] text-navy-400">
                            Drawn as{" "}
                            <span className="font-semibold text-navy-600">{spec.deedTitle}</span> ·{" "}
                            {spec.roleA.toLowerCase()} and {spec.roleB.toLowerCase()}
                          </p>
                        ) : null}

                        <div className="relative mt-4 flex items-center justify-between gap-2 border-t border-line pt-4">
                          <span className="inline-flex items-center gap-1.5 text-[12px] text-navy-500">
                            <Clock3 className="size-3.5" />
                            {spec ? `${spec.defaults.durationMonths} months` : template.term}
                          </span>
                          <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-brand-700">
                            Draft this
                            <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                          </span>
                        </div>
                      </Link>
                    </StaggerItem>
                  );
                })}
              </Stagger>
            </div>
          ))}
        </div>

        <Reveal delay={0.2}>
          <div className="mx-auto mt-14 flex max-w-6xl flex-wrap items-center justify-center gap-x-8 gap-y-3 rounded-2xl border border-line bg-white/70 px-7 py-5 backdrop-blur">
            {[
              "Free to draft — pay only on the confirming call",
              "Your progress saves automatically",
              "Switch template any time without losing your details",
              "Reword or strike out any clause before it is sent",
            ].map((item) => (
              <span
                key={item}
                className="flex items-center gap-2 text-[13.5px] font-medium text-navy-600"
              >
                <ShieldCheck className="size-4 shrink-0 text-emerald-500" />
                {item}
              </span>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.26}>
          <p className="mt-6 text-center text-[13px] text-navy-400">
            <Check className="mr-1.5 inline size-3.5 text-emerald-500" />
            Not sure which one? Start with the closest and change it inside the builder.
          </p>
        </Reveal>
      </div>
    </div>
  );
}
