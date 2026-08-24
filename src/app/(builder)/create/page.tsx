import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  Building2,
  Check,
  Clock3,
  Home,
  KeyRound,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { AGREEMENT_TYPES } from "@/lib/site";
import { Badge } from "@/components/ui/card";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/motion";
import type { AgreementType } from "@/lib/types";

export const metadata: Metadata = {
  title: "Choose Your Agreement Type",
  description:
    "Pick the right instrument for your situation — residential rental, commercial rental, lease deed or leave and licence — then fill in the details. Free until you pay.",
  alternates: { canonical: "/create" },
  // The self-serve builder is built but switched off — see the README. These
  // routes still render, so keep them out of the index until it goes live.
  robots: { index: false, follow: false },
};

const ICONS: Record<AgreementType, React.ComponentType<{ className?: string }>> = {
  residential: Home,
  commercial: Building2,
  lease: Briefcase,
  "leave-license": KeyRound,
};

export default function CreatePage() {
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
              Step 1 of 8 — no signup needed
            </Badge>
          </Reveal>
          <Reveal delay={0.06}>
            <h1 className="mt-6 text-[clamp(2rem,5vw,3.15rem)] leading-[1.1] font-bold tracking-[-0.03em] text-navy-950">
              What kind of agreement do you need?
            </h1>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-5 text-[17px] leading-[1.7] text-navy-600">
              Pick the instrument that matches your situation. If you get it wrong, don&apos;t
              worry — you can switch at any point and we will re-draft the clauses for you.
            </p>
          </Reveal>
        </div>

        <Stagger className="mx-auto mt-14 grid max-w-5xl gap-5 md:grid-cols-2" amount={0.1}>
          {AGREEMENT_TYPES.map((type) => {
            const Icon = ICONS[type.id];
            return (
              <StaggerItem key={type.id}>
                <Link
                  href={`/create/${type.id}`}
                  className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white p-7 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-brand-500 hover:shadow-lift"
                >
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -top-24 -right-20 size-52 rounded-full bg-brand-500/[0.08] opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
                  />
                  <div className="relative flex items-start justify-between gap-4">
                    <span className="grid size-12 place-items-center rounded-xl bg-navy-950 text-white transition-colors duration-300 group-hover:bg-brand-600">
                      <Icon className="size-5.5" />
                    </span>
                    {type.popular ? <Badge tone="brand">Most popular</Badge> : null}
                  </div>

                  <h2 className="relative mt-6 font-display text-[19px] font-bold text-navy-950">
                    {type.name}
                  </h2>
                  <p className="relative mt-2.5 flex-1 text-[14.5px] leading-[1.7] text-navy-500">
                    {type.description}
                  </p>

                  <ul className="relative mt-5 space-y-1.5">
                    {type.bestFor.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-[13.5px] text-navy-600">
                        <Check className="size-3.5 shrink-0 text-emerald-500" strokeWidth={3} />
                        {item}
                      </li>
                    ))}
                  </ul>

                  <div className="relative mt-6 flex items-center justify-between border-t border-line pt-5">
                    <span className="flex items-center gap-1.5 text-[12.5px] text-navy-400">
                      <Clock3 className="size-3.5" />
                      Usually {type.defaultMonths} months
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-brand-700">
                      Start
                      <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </StaggerItem>
            );
          })}
        </Stagger>

        <Reveal delay={0.3}>
          <div className="mx-auto mt-12 flex max-w-5xl flex-wrap items-center justify-center gap-x-8 gap-y-3 rounded-2xl border border-line bg-white/70 px-7 py-5 backdrop-blur">
            {[
              "Free to draft — pay only at the end",
              "Your progress saves automatically",
              "Switch type any time without losing data",
            ].map((item) => (
              <span key={item} className="flex items-center gap-2 text-[13.5px] font-medium text-navy-600">
                <ShieldCheck className="size-4 text-emerald-500" />
                {item}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </div>
  );
}
