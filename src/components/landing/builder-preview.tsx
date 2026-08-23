"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  Cloud,
  Dog,
  FileSignature,
  Home,
  IndianRupee,
  MousePointerClick,
  Sofa,
  SquareParking,
  Users,
} from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/card";
import { Reveal } from "@/components/ui/motion";
import { SectionHeading } from "@/components/ui/section-heading";
import { cn, inr } from "@/lib/utils";

const STEPS = [
  { id: 0, label: "Property", icon: Home },
  { id: 1, label: "Parties", icon: Users },
  { id: 2, label: "Terms", icon: IndianRupee },
  { id: 3, label: "Clauses", icon: FileSignature },
];

const RENTS = [15000, 22000, 35000, 50000];

export function BuilderPreview() {
  const [step, setStep] = useState(3);
  const [rent, setRent] = useState(22000);
  const [furnished, setFurnished] = useState(true);
  const [pets, setPets] = useState(false);
  const [parking, setParking] = useState(true);

  const deposit = rent * 5;
  const chargeable = rent * 11 + deposit;
  const duty = Math.round(chargeable * 0.01);

  const clauses = [
    { id: "grant", title: "Grant of Tenancy", always: true },
    { id: "rent", title: "Rent", always: true },
    { id: "deposit", title: "Security Deposit", always: true },
    { id: "furniture", title: "Fixtures, Fittings and Inventory", on: furnished, trigger: "Furnished" },
    { id: "parking", title: "Parking", on: parking, trigger: "Parking included" },
    { id: "pets", title: "Pets", on: pets, trigger: "Pets allowed" },
    { id: "notice", title: "Termination and Notice", always: true },
    { id: "law", title: "Governing Law and Jurisdiction", always: true },
  ];

  const active = clauses.filter((c) => c.always || c.on);
  const progress = Math.round(((step + 1) / STEPS.length) * 100);

  return (
    <section className="section relative overflow-hidden bg-white">
      <div className="container-page">
        <SectionHeading
          eyebrow="Agreement builder"
          icon={MousePointerClick}
          title="Watch the agreement write itself"
          body="Every answer you give changes the document beside you. Turn on pets and the pet clause appears. Change the rent and the stamp duty recalculates. Try it right here."
        />

        <Reveal delay={0.15} className="mt-16">
          <div className="overflow-hidden rounded-3xl border border-line bg-canvas shadow-lift">
            {/* Top bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-white px-5 py-4 sm:px-7">
              <div className="flex items-center gap-3">
                <span className="font-display text-[15px] font-bold text-navy-950">
                  Residential Rental Agreement
                </span>
                <Badge tone="neutral">RS-2026-448120</Badge>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 text-[12.5px] font-medium text-emerald-600">
                  <Cloud className="size-3.5" />
                  Saved just now
                </span>
                <div className="hidden items-center gap-2 sm:flex">
                  <div className="h-1.5 w-28 overflow-hidden rounded-full bg-navy-100">
                    <motion.div
                      className="h-full rounded-full bg-brand-600"
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </div>
                  <span className="tnum text-[12.5px] font-bold text-navy-600">{progress}%</span>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-[1fr_1.05fr]">
              {/* ── Controls ───────────────────────────────── */}
              <div className="border-line p-5 sm:p-7 lg:border-r">
                {/* stepper */}
                <div className="flex items-center gap-1.5">
                  {STEPS.map((s, i) => {
                    const done = i < step;
                    const current = i === step;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setStep(i)}
                        className={cn(
                          "flex flex-1 flex-col items-center gap-2 rounded-xl px-2 py-2.5 transition-colors",
                          current ? "bg-brand-50" : "hover:bg-navy-100/60",
                        )}
                      >
                        <span
                          className={cn(
                            "grid size-8 place-items-center rounded-full border-2 transition-all duration-300",
                            done
                              ? "border-emerald-500 bg-emerald-500 text-white"
                              : current
                                ? "border-brand-600 bg-brand-600 text-white"
                                : "border-navy-200 bg-white text-navy-400",
                          )}
                        >
                          {done ? <Check className="size-4" strokeWidth={3} /> : <s.icon className="size-4" />}
                        </span>
                        <span
                          className={cn(
                            "text-[11.5px] font-semibold",
                            current ? "text-brand-700" : done ? "text-navy-600" : "text-navy-400",
                          )}
                        >
                          {s.label}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-7 space-y-6">
                  {/* rent */}
                  <div>
                    <div className="mb-2.5 flex items-baseline justify-between">
                      <label className="text-[13.5px] font-semibold text-navy-800">
                        Monthly rent
                      </label>
                      <span className="tnum text-[13px] font-bold text-brand-700">{inr(rent)}</span>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {RENTS.map((r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setRent(r)}
                          className={cn(
                            "tnum rounded-lg border px-2 py-2.5 text-[13px] font-semibold transition-all",
                            rent === r
                              ? "border-brand-600 bg-brand-600 text-white shadow-[0_4px_12px_-4px_rgb(37_99_235/0.5)]"
                              : "border-line bg-white text-navy-600 hover:border-navy-300",
                          )}
                        >
                          {inr(r, { compact: true })}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* toggles */}
                  <div className="space-y-2.5">
                    {[
                      { label: "Property is furnished", desc: "Adds a signed inventory of every article", value: furnished, set: setFurnished, icon: Sofa },
                      { label: "Parking slot included", desc: "Allots a dedicated slot to the tenant", value: parking, set: setParking, icon: SquareParking },
                      { label: "Pets allowed", desc: "Permits pets subject to association rules", value: pets, set: setPets, icon: Dog },
                    ].map((row) => (
                      <button
                        key={row.label}
                        type="button"
                        onClick={() => row.set(!row.value)}
                        className={cn(
                          "flex w-full items-center gap-3.5 rounded-xl border p-3.5 text-left transition-all duration-200",
                          row.value ? "border-brand-300 bg-brand-50/50" : "border-line bg-white hover:border-navy-300",
                        )}
                      >
                        <span
                          className={cn(
                            "grid size-9 shrink-0 place-items-center rounded-lg transition-colors",
                            row.value ? "bg-brand-600 text-white" : "bg-navy-100 text-navy-500",
                          )}
                        >
                          <row.icon className="size-4" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-[14px] font-semibold text-navy-900">{row.label}</span>
                          <span className="mt-0.5 block text-[12px] leading-snug text-navy-500">{row.desc}</span>
                        </span>
                        <span
                          className={cn(
                            "relative inline-flex h-[24px] w-[42px] shrink-0 rounded-full p-0.5 transition-colors duration-300",
                            row.value ? "bg-brand-600" : "bg-navy-300",
                          )}
                        >
                          <span
                            className={cn(
                              "size-5 rounded-full bg-white shadow-sm transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
                              row.value ? "translate-x-[18px]" : "translate-x-0",
                            )}
                          />
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* live duty */}
                  <div className="rounded-xl border border-line bg-white p-4">
                    <div className="flex items-center justify-between text-[13px]">
                      <span className="font-medium text-navy-500">
                        Chargeable value (11 months + deposit)
                      </span>
                      <motion.span
                        key={chargeable}
                        initial={{ opacity: 0.4, y: -3 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="tnum font-semibold text-navy-900"
                      >
                        {inr(chargeable)}
                      </motion.span>
                    </div>
                    <div className="mt-2.5 flex items-center justify-between border-t border-line pt-2.5 text-[13px]">
                      <span className="font-medium text-navy-500">Stamp duty at 1%</span>
                      <motion.span
                        key={duty}
                        initial={{ opacity: 0.4, y: -3 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="tnum text-[15px] font-bold text-brand-700"
                      >
                        {inr(duty)}
                      </motion.span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Live preview ──────────────────────────── */}
              <div className="relative bg-navy-50/50 p-5 sm:p-7">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-[11.5px] font-bold tracking-[0.14em] text-navy-400 uppercase">
                    Live preview
                  </p>
                  <Badge tone="brand">
                    <span className="size-1.5 rounded-full bg-brand-600" />
                    {active.length} clauses
                  </Badge>
                </div>

                <div className="scroll-slim max-h-[500px] space-y-3 overflow-y-auto rounded-2xl border border-line bg-white p-5 shadow-soft">
                  <div className="border-b border-line pb-4 text-center">
                    <p className="text-[8.5px] font-bold tracking-[0.2em] text-navy-400 uppercase">
                      Government of Tamil Nadu
                    </p>
                    <h3 className="mt-1.5 font-display text-[13.5px] font-extrabold text-navy-950">
                      RESIDENTIAL RENTAL AGREEMENT
                    </h3>
                    <p className="tnum mt-1 text-[10px] text-navy-400">
                      {inr(rent)} per month · 11 months · Deposit {inr(deposit)}
                    </p>
                  </div>

                  <AnimatePresence initial={false} mode="popLayout">
                    {active.map((clause, i) => (
                      <motion.div
                        key={clause.id}
                        layout
                        initial={{ opacity: 0, height: 0, scale: 0.97 }}
                        animate={{ opacity: 1, height: "auto", scale: 1 }}
                        exit={{ opacity: 0, height: 0, scale: 0.97 }}
                        transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <div
                          className={cn(
                            "rounded-lg border p-3",
                            clause.trigger ? "border-brand-200 bg-brand-50/50" : "border-transparent",
                          )}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-[11.5px] font-bold text-navy-900">
                              {i + 1}. {clause.title}
                            </p>
                            {clause.trigger ? (
                              <span className="shrink-0 rounded-full bg-brand-600 px-2 py-0.5 text-[8.5px] font-bold tracking-wide text-white uppercase">
                                {clause.trigger}
                              </span>
                            ) : null}
                          </div>
                          <div className="mt-2 space-y-1.5">
                            {[100, 92, 64].map((w, j) => (
                              <div
                                key={j}
                                className={cn(
                                  "h-1.5 rounded-full",
                                  clause.trigger ? "bg-brand-200/70" : "bg-navy-100",
                                )}
                                style={{ width: `${w}%` }}
                              />
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                <p className="mt-4 text-center text-[12px] text-navy-400">
                  This is a working preview. The real builder has 40+ fields and 20 clause rules.
                </p>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.2} className="mt-10 flex justify-center">
          <ButtonLink href="/create" size="lg">
            Open the full builder
          </ButtonLink>
        </Reveal>
      </div>
    </section>
  );
}
