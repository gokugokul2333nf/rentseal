"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Cloud,
  CloudOff,
  Eye,
  FileText,
  IndianRupee,
  Loader2,
  Receipt,
  Sparkles,
  X,
} from "lucide-react";
import { useAgreement } from "@/lib/agreement-store";
import { clauseStats } from "@/lib/clauses";
import { calculateStampDuty } from "@/lib/stamp-duty";
import { AGREEMENT_TYPES } from "@/lib/site";
import { Button, ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/card";
import { Logo } from "@/components/ui/logo";
import { AgreementDocument } from "./agreement-document";
import { ClausesStep, PartyStep, PropertyStep, TermsStep } from "./steps";
import { PaymentStep, ReviewStep } from "./review-payment";
import { cn, inr } from "@/lib/utils";
import type { AgreementType } from "@/lib/types";

const STEPS = [
  { key: "property", label: "Property", short: "Property" },
  { key: "landlord", label: "Landlord details", short: "Landlord" },
  { key: "tenant", label: "Tenant details", short: "Tenant" },
  { key: "terms", label: "Agreement terms", short: "Terms" },
  { key: "clauses", label: "Additional clauses", short: "Clauses" },
  { key: "review", label: "Review", short: "Review" },
  { key: "payment", label: "Payment", short: "Payment" },
] as const;

function SaveIndicator() {
  const { saving, savedAt } = useAgreement();
  if (saving) {
    return (
      <span className="flex items-center gap-1.5 text-[12.5px] font-medium text-navy-400">
        <Loader2 className="size-3.5 animate-spin" />
        Saving…
      </span>
    );
  }
  if (savedAt) {
    return (
      <span className="flex items-center gap-1.5 text-[12.5px] font-medium text-emerald-600">
        <Cloud className="size-3.5" />
        Draft saved
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1.5 text-[12.5px] font-medium text-navy-400">
      <CloudOff className="size-3.5" />
      Not saved yet
    </span>
  );
}

/** Sticky right rail: live cost, clause count, and the document preview. */
function SummaryRail({ onOpenPreview }: { onOpenPreview: () => void }) {
  const { draft } = useAgreement();
  const stats = useMemo(() => clauseStats(draft), [draft]);
  const breakdown = useMemo(
    () =>
      calculateStampDuty({
        monthlyRent: parseFloat(draft.terms.monthlyRent || "0"),
        securityDeposit: parseFloat(draft.terms.securityDeposit || "0"),
        durationMonths: draft.terms.durationMonths,
        plan: draft.plan,
        registerAnyway: draft.options.registrationRequired,
        lawyerReview: draft.options.lawyerReview,
      }),
    [draft],
  );

  return (
    <div className="space-y-4">
      {/* Cost */}
      <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-soft">
        <div className="flex items-center gap-2 border-b border-line bg-navy-50 px-5 py-3">
          <Receipt className="size-4 text-navy-500" />
          <h2 className="text-[13px] font-bold text-navy-950">Running total</h2>
        </div>
        <dl className="divide-y divide-line">
          {[
            { label: "Stamp duty", value: breakdown.stampDuty, hint: "1% · Govt of TN" },
            breakdown.registrationRequired
              ? { label: "Registration fee", value: breakdown.registrationFee, hint: "1% · Govt of TN" }
              : null,
            { label: "Platform fee", value: breakdown.platformFee, hint: "RentSeal" },
            breakdown.lawyerFee > 0
              ? { label: "Advocate review", value: breakdown.lawyerFee, hint: "Bar Council TN" }
              : null,
            { label: "GST", value: breakdown.gst, hint: "18% on our fee" },
          ]
            .filter(Boolean)
            .map((row) => {
              const r = row as { label: string; value: number; hint: string };
              return (
                <div key={r.label} className="flex items-start justify-between px-5 py-2.5">
                  <dt className="text-[13px] text-navy-600">
                    {r.label}
                    <span className="block text-[11px] text-navy-400">{r.hint}</span>
                  </dt>
                  <dd className="tnum text-[13.5px] font-semibold text-navy-950">{inr(r.value)}</dd>
                </div>
              );
            })}
          <div className="flex items-center justify-between bg-navy-950 px-5 py-3.5">
            <dt className="text-[13px] font-semibold text-white/70">Total</dt>
            <motion.dd
              key={breakdown.total}
              initial={{ opacity: 0.5, y: -3 }}
              animate={{ opacity: 1, y: 0 }}
              className="tnum font-display text-[19px] font-bold text-white"
            >
              {inr(breakdown.total)}
            </motion.dd>
          </div>
        </dl>
      </div>

      {/* Clause counter */}
      <div className="rounded-2xl border border-line bg-white p-5 shadow-soft">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-[13px] font-bold text-navy-950">
            <Sparkles className="size-4 text-brand-600" />
            Clauses generated
          </h2>
          <span className="tnum font-display text-[19px] font-bold text-navy-950">
            {stats.total}
          </span>
        </div>
        {stats.triggers.length ? (
          <>
            <p className="mt-2.5 text-[12px] text-navy-500">
              {stats.conditional} added from your answers:
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <AnimatePresence initial={false}>
                {stats.triggers.map((trigger) => (
                  <motion.span
                    key={trigger}
                    layout
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.85 }}
                    transition={{ duration: 0.22 }}
                    className="rounded-full border border-brand-200 bg-brand-50 px-2.5 py-1 text-[11px] font-semibold text-brand-700"
                  >
                    {trigger}
                  </motion.span>
                ))}
              </AnimatePresence>
            </div>
          </>
        ) : (
          <p className="mt-2.5 text-[12px] text-navy-500">
            Answer more questions and conditional clauses will appear here.
          </p>
        )}
      </div>

      {/* Live document */}
      <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-soft">
        <div className="flex items-center justify-between border-b border-line bg-navy-50 px-5 py-3">
          <h2 className="flex items-center gap-2 text-[13px] font-bold text-navy-950">
            <FileText className="size-4 text-navy-500" />
            Live document
          </h2>
          <button
            type="button"
            onClick={onOpenPreview}
            className="flex items-center gap-1.5 text-[12px] font-semibold text-brand-700 hover:underline"
          >
            <Eye className="size-3.5" />
            Expand
          </button>
        </div>
        <div className="scroll-slim max-h-[420px] overflow-y-auto p-5">
          <div className="origin-top scale-[0.82]">
            <AgreementDocument draft={draft} />
          </div>
        </div>
      </div>
    </div>
  );
}

export function BuilderShell({ type }: { type: AgreementType }) {
  const router = useRouter();
  const { draft, setType, hydrated } = useAgreement();
  const [step, setStep] = useState(0);
  const [previewOpen, setPreviewOpen] = useState(false);

  const meta = AGREEMENT_TYPES.find((t) => t.id === type);

  // Keep the store in step with the route the user landed on.
  useEffect(() => {
    if (hydrated && draft.type !== type) setType(type);
  }, [hydrated, draft.type, type, setType]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  const progress = Math.round(((step + 1) / STEPS.length) * 100);
  const isPayment = STEPS[step].key === "payment";

  const body = () => {
    switch (STEPS[step].key) {
      case "property":
        return <PropertyStep />;
      case "landlord":
        return <PartyStep which="landlord" />;
      case "tenant":
        return <PartyStep which="tenant" />;
      case "terms":
        return <TermsStep />;
      case "clauses":
        return <ClausesStep />;
      case "review":
        return <ReviewStep />;
      case "payment":
        return <PaymentStep onPaid={() => router.push(`/success?id=${draft.id}`)} />;
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      {/* ── Top bar ─────────────────────────────────────────── */}
      <header className="no-print sticky top-0 z-30 border-b border-line bg-white/85 backdrop-blur-xl">
        <div className="container-page flex h-[62px] items-center justify-between gap-4">
          <div className="flex items-center gap-5">
            <Logo />
            <div className="hidden border-l border-line pl-5 lg:block">
              <p className="text-[13.5px] font-semibold text-navy-950">{meta?.name}</p>
              <p className="text-[11.5px] text-navy-400">{draft.id}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <SaveIndicator />
            <ButtonLink href="/" variant="ghost" size="sm" className="hidden sm:inline-flex">
              <X className="size-4" />
              Save &amp; exit
            </ButtonLink>
          </div>
        </div>

        {/* Progress */}
        <div className="h-[3px] w-full bg-navy-100">
          <motion.div
            className="h-full bg-gradient-to-r from-brand-600 to-emerald-500"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
      </header>

      {/* ── Stepper ─────────────────────────────────────────── */}
      <nav aria-label="Progress" className="no-print border-b border-line bg-white">
        <div className="container-page scroll-slim flex items-center gap-1 overflow-x-auto py-3">
          {STEPS.map((s, i) => {
            const done = i < step;
            const current = i === step;
            return (
              <button
                key={s.key}
                type="button"
                onClick={() => setStep(i)}
                aria-current={current ? "step" : undefined}
                className={cn(
                  "flex shrink-0 items-center gap-2 rounded-full px-3.5 py-2 text-[13px] font-semibold transition-colors",
                  current
                    ? "bg-brand-600 text-white"
                    : done
                      ? "text-emerald-700 hover:bg-emerald-50"
                      : "text-navy-400 hover:bg-navy-100",
                )}
              >
                <span
                  className={cn(
                    "grid size-5 place-items-center rounded-full text-[10px] font-bold",
                    current
                      ? "bg-white/20 text-white"
                      : done
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-navy-100 text-navy-500",
                  )}
                >
                  {done ? <Check className="size-3" strokeWidth={3.5} /> : i + 1}
                </span>
                {s.short}
              </button>
            );
          })}
        </div>
      </nav>

      {/* ── Body ────────────────────────────────────────────── */}
      <div className="container-page flex-1 py-8 lg:py-12">
        <div className={cn("grid gap-8", !isPayment && "xl:grid-cols-[minmax(0,1fr)_360px]")}>
          <div className="min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={STEPS[step].key}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="rounded-2xl border border-line bg-white p-6 shadow-soft sm:p-8"
              >
                {body()}
              </motion.div>
            </AnimatePresence>

            {/* Nav */}
            {!isPayment ? (
              <div className="no-print mt-6 flex items-center justify-between gap-4">
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => setStep((s) => Math.max(0, s - 1))}
                  disabled={step === 0}
                >
                  <ArrowLeft className="size-4" />
                  Back
                </Button>

                <div className="flex items-center gap-3">
                  <span className="hidden text-[13px] text-navy-400 sm:inline">
                    Step {step + 1} of {STEPS.length}
                  </span>
                  <Button
                    size="lg"
                    onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
                    className="group"
                  >
                    {STEPS[step + 1]?.key === "review" ? "Review agreement" : "Continue"}
                    <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="no-print mt-6">
                <Button variant="ghost" size="lg" onClick={() => setStep((s) => s - 1)}>
                  <ArrowLeft className="size-4" />
                  Back to review
                </Button>
              </div>
            )}

            {/* Mobile helper */}
            <div className="no-print mt-6 flex items-center justify-between rounded-2xl border border-line bg-white p-4 xl:hidden">
              <div className="flex items-center gap-2.5">
                <IndianRupee className="size-4 text-navy-400" />
                <span className="text-[13px] text-navy-500">Running total</span>
              </div>
              <button
                type="button"
                onClick={() => setPreviewOpen(true)}
                className="flex items-center gap-1.5 text-[13px] font-semibold text-brand-700"
              >
                <Eye className="size-4" />
                See document &amp; costs
              </button>
            </div>
          </div>

          {!isPayment ? (
            <aside className="no-print hidden xl:block">
              <div className="sticky top-[124px]">
                <SummaryRail onOpenPreview={() => setPreviewOpen(true)} />
              </div>
            </aside>
          ) : null}
        </div>
      </div>

      {/* ── Expanded preview ────────────────────────────────── */}
      <AnimatePresence>
        {previewOpen ? (
          <motion.div
            className="no-print fixed inset-0 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div
              className="absolute inset-0 bg-navy-950/50 backdrop-blur-sm"
              onClick={() => setPreviewOpen(false)}
            />
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 24, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-x-3 top-6 bottom-6 mx-auto flex max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-lift sm:inset-x-6"
            >
              <div className="flex shrink-0 items-center justify-between border-b border-line px-5 py-4">
                <div className="flex items-center gap-3">
                  <h2 className="font-display text-[16px] font-bold text-navy-950">
                    Live document
                  </h2>
                  <Badge tone="brand">{clauseStats(draft).total} clauses</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => window.print()}>
                    Print
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="!px-2.5"
                    aria-label="Close preview"
                    onClick={() => setPreviewOpen(false)}
                  >
                    <X className="size-4" />
                  </Button>
                </div>
              </div>
              <div className="scroll-slim flex-1 overflow-y-auto bg-navy-50 p-4 sm:p-8">
                <div className="mx-auto max-w-3xl rounded-xl bg-white p-6 shadow-card sm:p-12">
                  <AgreementDocument draft={draft} animate={false} />
                </div>
              </div>
              <div className="shrink-0 border-t border-line bg-white px-5 py-3 xl:hidden">
                <SummaryRailMobile />
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Printable copy — hidden on screen, laid out for A4 */}
      <div className="hidden print:block">
        <AgreementDocument draft={draft} animate={false} />
      </div>

      <footer className="no-print border-t border-line bg-white py-6">
        <div className="container-page flex flex-wrap items-center justify-between gap-4 text-[12.5px] text-navy-400">
          <p>Your draft is stored on this device until you pay. Nothing is shared with anyone.</p>
          <Link href="/legal/privacy" className="font-medium underline underline-offset-4">
            How we handle your data
          </Link>
        </div>
      </footer>
    </div>
  );
}

function SummaryRailMobile() {
  const { draft } = useAgreement();
  const breakdown = calculateStampDuty({
    monthlyRent: parseFloat(draft.terms.monthlyRent || "0"),
    securityDeposit: parseFloat(draft.terms.securityDeposit || "0"),
    durationMonths: draft.terms.durationMonths,
    plan: draft.plan,
    registerAnyway: draft.options.registrationRequired,
    lawyerReview: draft.options.lawyerReview,
  });
  return (
    <div className="flex items-center justify-between">
      <span className="text-[13px] text-navy-500">
        Stamp duty {inr(breakdown.stampDuty)} · Fee {inr(breakdown.platformFee + breakdown.gst)}
      </span>
      <span className="tnum text-[16px] font-bold text-navy-950">{inr(breakdown.total)}</span>
    </div>
  );
}
