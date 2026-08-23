"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeIndianRupee,
  Bike,
  CheckCircle2,
  Clock3,
  FileStack,
  ShieldCheck,
  Stamp,
  Truck,
} from "lucide-react";
import { DELIVERY_RULES, DELIVERY_ZONES, DENOMINATIONS, STAMP_USE_CASES } from "@/lib/stamp-paper";
import { LEAD_ANCHOR } from "@/lib/site";
import { ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/card";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/motion";
import { SectionHeading } from "@/components/ui/section-heading";
import { cn, inr } from "@/lib/utils";

export function StampPaper() {
  const [selected, setSelected] = useState(100);
  const active = DENOMINATIONS.find((d) => d.value === selected) ?? DENOMINATIONS[2];

  return (
    <section id="stamp-paper" className="section scroll-mt-20 bg-white">
      <div className="container-page">
        <SectionHeading
          eyebrow="Stamp paper, delivered"
          icon={Stamp}
          title="Licensed stamp paper at your door, anywhere in Tamil Nadu"
          body="No hunting for a vendor who has shut for lunch, no queue at the treasury. Tell us the denomination and the address — we procure it at face value and a rider brings it to you."
        />

        <div className="mt-16 grid gap-6 lg:grid-cols-[1.15fr_1fr] lg:gap-10">
          {/* ── Denominations ──────────────────────────────── */}
          <Reveal>
            <div className="rounded-3xl border border-line bg-canvas p-6 sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-display text-[18px] font-bold text-navy-950">
                    Choose your denomination
                  </h3>
                  <p className="mt-1.5 text-[13.5px] text-navy-500">
                    Non-judicial stamp paper and e-Stamp certificates, all at face value.
                  </p>
                </div>
                <Badge tone="emerald" className="hidden shrink-0 sm:inline-flex">
                  <BadgeIndianRupee className="size-3" />
                  No markup
                </Badge>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                {DENOMINATIONS.map((d) => {
                  const isActive = d.value === selected;
                  return (
                    <button
                      key={d.label}
                      type="button"
                      onClick={() => setSelected(d.value)}
                      aria-pressed={isActive}
                      className={cn(
                        "relative rounded-xl border p-4 text-left transition-all duration-200",
                        isActive
                          ? "border-brand-600 bg-brand-600 text-white shadow-[0_8px_24px_-8px_rgb(37_99_235/0.55)]"
                          : "border-line bg-white hover:border-navy-300 hover:bg-navy-50/60",
                      )}
                    >
                      {d.popular ? (
                        <span
                          className={cn(
                            "absolute -top-2 right-3 rounded-full px-2 py-0.5 text-[9px] font-bold tracking-wide uppercase",
                            isActive ? "bg-white text-brand-700" : "bg-navy-950 text-white",
                          )}
                        >
                          Most used
                        </span>
                      ) : null}
                      <span
                        className={cn(
                          "block font-display text-[22px] font-extrabold tracking-tight",
                          isActive ? "text-white" : "text-navy-950",
                        )}
                      >
                        {d.label}
                      </span>
                      <span
                        className={cn(
                          "mt-1 block text-[11.5px] leading-snug",
                          isActive ? "text-white/70" : "text-navy-400",
                        )}
                      >
                        {d.value === 0 ? "e-Stamp certificate" : "Stamp paper"}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* What it's used for */}
              <motion.div
                key={active.label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="mt-5 rounded-2xl border border-line bg-white p-5"
              >
                <p className="text-[11.5px] font-bold tracking-[0.12em] text-navy-400 uppercase">
                  {active.label} is commonly used for
                </p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {active.uses.map((use) => (
                    <li
                      key={use}
                      className="flex items-center gap-1.5 rounded-full border border-line bg-canvas px-3 py-1.5 text-[12.5px] font-medium text-navy-600"
                    >
                      <CheckCircle2 className="size-3.5 text-emerald-500" />
                      {use}
                    </li>
                  ))}
                </ul>
                {active.note ? (
                  <p className="mt-3.5 border-t border-line pt-3.5 text-[12.5px] leading-relaxed text-navy-500">
                    {active.note}
                  </p>
                ) : null}
              </motion.div>

              <ButtonLink href={LEAD_ANCHOR} size="lg" fullWidth className="mt-5 group">
                Order {active.label} stamp paper
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </ButtonLink>
            </div>
          </Reveal>

          {/* ── Delivery ───────────────────────────────────── */}
          <Reveal delay={0.1}>
            <div className="flex h-full flex-col gap-4">
              <div className="rounded-3xl border border-line bg-navy-950 p-6 text-white sm:p-7">
                <span className="grid size-11 place-items-center rounded-xl bg-white/10">
                  <Truck className="size-5 text-brand-400" />
                </span>
                <h3 className="mt-5 font-display text-[18px] font-bold">
                  Delivered across all 38 districts
                </h3>
                <p className="mt-2 text-[14px] leading-relaxed text-white/60">
                  Same-day inside Chennai, next day in the major cities, and two to three
                  working days everywhere else in Tamil Nadu.
                </p>

                <ul className="mt-6 space-y-3">
                  {DELIVERY_ZONES.map((zone) => (
                    <li
                      key={zone.id}
                      className="flex items-start justify-between gap-4 border-b border-white/10 pb-3 last:border-0 last:pb-0"
                    >
                      <div className="min-w-0">
                        <p className="text-[13.5px] font-semibold text-white">{zone.name}</p>
                        <p className="mt-0.5 text-[11.5px] leading-snug text-white/45">
                          {zone.districts.slice(0, 4).join(", ")}
                          {zone.districts.length > 4 ? ` +${zone.districts.length - 4} more` : ""}
                        </p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="flex items-center justify-end gap-1.5 text-[13px] font-bold text-emerald-400">
                          <Clock3 className="size-3.5" />
                          {zone.eta}
                        </p>
                        <p className="tnum mt-0.5 text-[11.5px] text-white/45">
                          {inr(zone.charge)} delivery
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 space-y-2 rounded-xl bg-white/[0.07] p-4">
                  {[
                    `Delivery is free on any order above ${inr(DELIVERY_RULES.freeAbove)} of stamp value`,
                    `Free everywhere on ${DELIVERY_RULES.bulkFreeFrom} sheets or more`,
                    "e-Stamp certificates are issued instantly by email — nothing to deliver",
                  ].map((line) => (
                    <p key={line} className="flex items-start gap-2 text-[12.5px] leading-relaxed text-white/70">
                      <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-emerald-400" />
                      {line}
                    </p>
                  ))}
                </div>
              </div>

              <div className="grid flex-1 grid-cols-2 gap-4">
                {[
                  {
                    icon: ShieldCheck,
                    title: "Licensed source",
                    body: "Procured through authorised vendors and the state e-Stamp channel. Every sheet is verifiable.",
                  },
                  {
                    icon: Bike,
                    title: "Face value only",
                    body: "You pay the printed value plus a flat delivery fee. We never inflate the denomination.",
                  },
                ].map((item) => (
                  <div key={item.title} className="rounded-2xl border border-line bg-canvas p-5">
                    <item.icon className="size-5 text-brand-600" />
                    <h4 className="mt-3.5 font-display text-[14.5px] font-bold text-navy-950">
                      {item.title}
                    </h4>
                    <p className="mt-1.5 text-[12.5px] leading-relaxed text-navy-500">{item.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>

        {/* ── Use cases ──────────────────────────────────── */}
        <div className="mt-16">
          <Reveal>
            <div className="mb-8 flex items-center gap-3">
              <FileStack className="size-5 text-brand-600" />
              <h3 className="font-display text-[19px] font-bold text-navy-950">
                Not sure which denomination you need?
              </h3>
            </div>
          </Reveal>

          <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" amount={0.05}>
            {STAMP_USE_CASES.map((useCase) => (
              <StaggerItem key={useCase.title}>
                <div className="h-full rounded-2xl border border-line bg-canvas/60 p-6 transition-colors hover:bg-white">
                  <div className="flex items-start justify-between gap-3">
                    <h4 className="font-display text-[15.5px] font-bold text-navy-950">
                      {useCase.title}
                    </h4>
                  </div>
                  <p className="mt-2 inline-block rounded-full border border-brand-200 bg-brand-50 px-2.5 py-1 text-[11.5px] font-bold text-brand-700">
                    {useCase.denomination}
                  </p>
                  <p className="mt-3 text-[13.5px] leading-[1.7] text-navy-500">{useCase.body}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>

          <Reveal delay={0.15}>
            <div className="mt-8 flex flex-col items-start justify-between gap-5 rounded-2xl border border-line bg-canvas p-6 sm:flex-row sm:items-center sm:p-7">
              <p className="max-w-xl text-[14.5px] leading-relaxed text-navy-600">
                Still unsure? Tell us what the document is for and we will tell you the
                denomination the registrar or the office asking for it will accept — before you
                spend anything.
              </p>
              <ButtonLink href={LEAD_ANCHOR} size="lg" className="shrink-0">
                Ask us which one
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
