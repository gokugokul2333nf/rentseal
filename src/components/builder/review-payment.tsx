"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  Building2,
  CreditCard,
  FileCheck2,
  Landmark,
  Lock,
  Printer,
  Scale,
  Smartphone,
  Tag,
  Wallet,
} from "lucide-react";
import { useAgreement } from "@/lib/agreement-store";
import { PLANS } from "@/lib/site";
import { calculateStampDuty, splitGovernmentAndService } from "@/lib/stamp-duty";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/card";
import { Field, Input, OptionCards } from "@/components/ui/field";
import { AgreementDocument } from "./agreement-document";
import { StepIntro } from "./steps";
import { cn, formatDate, inr } from "@/lib/utils";
import type { PlanId } from "@/lib/types";

/* ══════════════════════════ 6. Review ══════════════════════════ */

export function ReviewStep() {
  const { draft } = useAgreement();

  const missing: string[] = [];
  if (!draft.landlord.fullName) missing.push("Landlord's full name");
  if (!draft.tenant.fullName) missing.push("Tenant's full name");
  if (!draft.property.doorNo && !draft.property.street) missing.push("Property address");
  if (!draft.terms.monthlyRent) missing.push("Monthly rent");
  if (!draft.terms.securityDeposit) missing.push("Security deposit");
  if (!draft.landlord.phone) missing.push("Landlord's mobile number");
  if (!draft.tenant.phone) missing.push("Tenant's mobile number");

  return (
    <>
      <StepIntro
        title="Read it before you pay"
        body="This is the exact document that will be stamped and signed — nothing is added afterwards. Take a minute over it."
      />

      {missing.length ? (
        <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 size-5 shrink-0 text-amber-600" />
            <div>
              <h3 className="text-[14px] font-bold text-amber-900">
                {missing.length} thing{missing.length === 1 ? "" : "s"} still to fill in
              </h3>
              <p className="mt-1 text-[13px] text-amber-800">
                The gaps show as shaded blanks in the document below. You can pay and complete
                them later, but the agreement is not valid until they are filled.
              </p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {missing.map((m) => (
                  <li
                    key={m}
                    className="rounded-full border border-amber-300 bg-white px-2.5 py-1 text-[12px] font-medium text-amber-900"
                  >
                    {m}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
          <FileCheck2 className="size-5 shrink-0 text-emerald-600" />
          <p className="text-[14px] font-medium text-emerald-900">
            Everything essential is filled in. Your agreement is ready to be stamped.
          </p>
        </div>
      )}

      <div className="flex items-center justify-between gap-4 rounded-t-2xl border border-b-0 border-line bg-navy-50 px-5 py-3.5">
        <div className="flex items-center gap-2.5">
          <Badge tone="neutral">{draft.id}</Badge>
          <span className="hidden text-[12.5px] text-navy-500 sm:inline">
            Updated {formatDate(draft.updatedAt)}
          </span>
        </div>
        <Button variant="ghost" size="sm" onClick={() => window.print()} className="no-print">
          <Printer className="size-4" />
          Print preview
        </Button>
      </div>

      <div className="scroll-slim max-h-[70vh] overflow-y-auto rounded-b-2xl border border-line bg-white p-6 shadow-soft sm:p-10">
        <AgreementDocument draft={draft} animate={false} />
      </div>
    </>
  );
}

/* ══════════════════════════ 7. Payment ══════════════════════════ */

const COUPONS: Record<string, { off: number; label: string }> = {
  FIRSTRENT: { off: 100, label: "₹100 off your first agreement" },
  CHENNAI50: { off: 50, label: "₹50 off — Chennai launch offer" },
  BROKER200: { off: 200, label: "₹200 off — registered broker rate" },
};

export function PaymentStep({ onPaid }: { onPaid: () => void }) {
  const { draft, setPlan, update } = useAgreement();
  const [method, setMethod] = useState<"upi" | "card" | "netbanking" | "wallet">("upi");
  const [couponInput, setCouponInput] = useState("");
  const [coupon, setCoupon] = useState<{ code: string; off: number; label: string } | null>(null);
  const [couponError, setCouponError] = useState("");
  const [processing, setProcessing] = useState(false);
  const [gstInvoice, setGstInvoice] = useState(false);

  const breakdown = calculateStampDuty({
    monthlyRent: parseFloat(draft.terms.monthlyRent || "0"),
    securityDeposit: parseFloat(draft.terms.securityDeposit || "0"),
    durationMonths: draft.terms.durationMonths,
    plan: draft.plan,
    registerAnyway: draft.options.registrationRequired,
    lawyerReview: draft.options.lawyerReview,
  });
  const split = splitGovernmentAndService(breakdown);
  const discount = coupon?.off ?? 0;
  const payable = Math.max(0, breakdown.total - discount);

  const applyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    const found = COUPONS[code];
    if (!found) {
      setCouponError("That code isn't valid. Try FIRSTRENT.");
      setCoupon(null);
      return;
    }
    setCoupon({ code, ...found });
    setCouponError("");
  };

  const pay = () => {
    setProcessing(true);
    // Stands in for the gateway round-trip.
    setTimeout(onPaid, 1800);
  };

  return (
    <>
      <StepIntro
        title="Pay and we start stamping"
        body="Government charges and our fee are shown separately. You can check the duty figure against the Registration Department's own rate — we never mark it up."
      />

      <div className="space-y-6">
        {/* Plan */}
        <div>
          <h3 className="mb-3 text-[14px] font-bold text-navy-950">Your plan</h3>
          <div className="grid gap-2.5 sm:grid-cols-3">
            {PLANS.map((plan) => {
              const active = draft.plan === plan.id;
              return (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => setPlan(plan.id as PlanId)}
                  className={cn(
                    "rounded-xl border p-4 text-left transition-all duration-200",
                    active
                      ? "border-brand-600 bg-brand-50/60 shadow-[0_0_0_3px_rgb(37_99_235/0.10)]"
                      : "border-line bg-white hover:border-navy-300",
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={cn(
                        "text-[14px] font-bold",
                        active ? "text-brand-800" : "text-navy-900",
                      )}
                    >
                      {plan.name}
                    </span>
                    {plan.recommended ? <Badge tone="brand">Popular</Badge> : null}
                  </div>
                  <p className="tnum mt-1.5 text-[19px] font-extrabold text-navy-950">
                    {inr(plan.price)}
                  </p>
                  <p className="mt-1 text-[12px] leading-snug text-navy-500">{plan.delivery}</p>
                </button>
              );
            })}
          </div>

          {draft.plan !== "premium" ? (
            <label className="mt-3 flex cursor-pointer items-start gap-3 rounded-xl border border-line bg-white p-4">
              <input
                type="checkbox"
                checked={draft.options.lawyerReview}
                onChange={(e) => update({ options: { lawyerReview: e.target.checked } })}
                className="mt-0.5 size-4 shrink-0 accent-[#2563eb]"
              />
              <span className="flex-1">
                <span className="flex items-center gap-2 text-[14px] font-semibold text-navy-900">
                  <Scale className="size-4 text-brand-600" />
                  Add advocate verification — ₹700
                </span>
                <span className="mt-0.5 block text-[12.5px] text-navy-500">
                  An advocate enrolled with the Bar Council of Tamil Nadu reads every clause and
                  signs off within 24 hours. Included free on Premium.
                </span>
              </span>
            </label>
          ) : null}
        </div>

        {/* Breakdown */}
        <div className="overflow-hidden rounded-2xl border border-line bg-white">
          <div className="border-b border-line bg-navy-50 px-5 py-3.5">
            <h3 className="text-[14px] font-bold text-navy-950">What you are paying for</h3>
          </div>

          <div className="divide-y divide-line">
            <div className="px-5 py-4">
              <p className="mb-3 flex items-center gap-2 text-[11.5px] font-bold tracking-[0.12em] text-navy-400 uppercase">
                <Landmark className="size-3.5" />
                Government of Tamil Nadu — paid at cost
              </p>
              <dl className="space-y-2.5">
                <div className="flex items-center justify-between text-[14px]">
                  <dt className="text-navy-600">
                    Stamp duty
                    <span className="ml-1.5 text-[12px] text-navy-400">
                      1% of {inr(breakdown.chargeableValue)}
                    </span>
                  </dt>
                  <dd className="tnum font-semibold text-navy-950">{inr(breakdown.stampDuty)}</dd>
                </div>
                {breakdown.registrationRequired ? (
                  <div className="flex items-center justify-between text-[14px]">
                    <dt className="text-navy-600">
                      Registration fee
                      <span className="ml-1.5 text-[12px] text-navy-400">1%</span>
                    </dt>
                    <dd className="tnum font-semibold text-navy-950">
                      {inr(breakdown.registrationFee)}
                    </dd>
                  </div>
                ) : null}
              </dl>
            </div>

            <div className="px-5 py-4">
              <p className="mb-3 flex items-center gap-2 text-[11.5px] font-bold tracking-[0.12em] text-navy-400 uppercase">
                <Tag className="size-3.5" />
                RentSeal
              </p>
              <dl className="space-y-2.5">
                <div className="flex items-center justify-between text-[14px]">
                  <dt className="text-navy-600">
                    {PLANS.find((p) => p.id === draft.plan)?.name} plan
                  </dt>
                  <dd className="tnum font-semibold text-navy-950">{inr(breakdown.platformFee)}</dd>
                </div>
                {breakdown.lawyerFee > 0 ? (
                  <div className="flex items-center justify-between text-[14px]">
                    <dt className="text-navy-600">Advocate verification</dt>
                    <dd className="tnum font-semibold text-navy-950">{inr(breakdown.lawyerFee)}</dd>
                  </div>
                ) : null}
                <div className="flex items-center justify-between text-[14px]">
                  <dt className="text-navy-600">
                    GST at 18%
                    <span className="ml-1.5 text-[12px] text-navy-400">on our fee only</span>
                  </dt>
                  <dd className="tnum font-semibold text-navy-950">{inr(breakdown.gst)}</dd>
                </div>
              </dl>
            </div>

            {coupon ? (
              <div className="flex items-center justify-between bg-emerald-50 px-5 py-3.5 text-[14px]">
                <span className="flex items-center gap-2 font-medium text-emerald-800">
                  <Tag className="size-4" />
                  {coupon.code} — {coupon.label}
                </span>
                <span className="tnum font-bold text-emerald-700">−{inr(discount)}</span>
              </div>
            ) : null}

            <div className="flex items-center justify-between bg-navy-950 px-5 py-4">
              <span className="text-[14px] font-semibold text-white/70">Total payable</span>
              <motion.span
                key={payable}
                initial={{ opacity: 0.5, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="tnum font-display text-[24px] font-extrabold text-white"
              >
                {inr(payable)}
              </motion.span>
            </div>
          </div>
        </div>

        <p className="text-[12.5px] leading-relaxed text-navy-400">
          Of this, {inr(split.government)} goes to the Government of Tamil Nadu and{" "}
          {inr(split.service)} to us. The government portion is remitted in full and appears on
          your e-Stamp certificate.
        </p>

        {/* Coupon */}
        <div className="rounded-2xl border border-line bg-white p-5">
          <h3 className="text-[14px] font-bold text-navy-950">Have a coupon?</h3>
          <div className="mt-3 flex gap-2.5">
            <Input
              value={couponInput}
              onChange={(e) => {
                setCouponInput(e.target.value.toUpperCase());
                setCouponError("");
              }}
              placeholder="FIRSTRENT"
              className="max-w-[220px] uppercase"
            />
            <Button variant="secondary" onClick={applyCoupon}>
              Apply
            </Button>
          </div>
          {couponError ? (
            <p className="mt-2 text-[12.5px] font-medium text-rose-600">{couponError}</p>
          ) : null}
        </div>

        {/* Method */}
        <div>
          <h3 className="mb-3 text-[14px] font-bold text-navy-950">How would you like to pay?</h3>
          <OptionCards
            name="Payment method"
            columns={4}
            value={method}
            onChange={setMethod}
            options={[
              { value: "upi" as const, label: "UPI", desc: "GPay, PhonePe, Paytm", icon: Smartphone },
              { value: "card" as const, label: "Card", desc: "Credit or debit", icon: CreditCard },
              { value: "netbanking" as const, label: "Net banking", desc: "58 banks", icon: Building2 },
              { value: "wallet" as const, label: "Wallet", desc: "Paytm, Amazon Pay", icon: Wallet },
            ]}
          />
        </div>

        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-line bg-white p-4">
          <input
            type="checkbox"
            checked={gstInvoice}
            onChange={(e) => setGstInvoice(e.target.checked)}
            className="mt-0.5 size-4 shrink-0 accent-[#2563eb]"
          />
          <span className="flex-1">
            <span className="text-[14px] font-semibold text-navy-900">
              I need a GST invoice
            </span>
            <span className="mt-0.5 block text-[12.5px] text-navy-500">
              For claiming input credit. We will ask for your GSTIN after payment.
            </span>
          </span>
        </label>

        {gstInvoice ? (
          <div className="max-w-sm">
            <Field label="GSTIN" help="15 characters, as printed on your registration certificate.">
              {(id) => <Input id={id} placeholder="33AABCR1234M1ZX" className="uppercase" maxLength={15} />}
            </Field>
          </div>
        ) : null}

        <Button size="xl" fullWidth onClick={pay} disabled={processing}>
          {processing ? (
            <>
              <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Contacting your bank…
            </>
          ) : (
            <>
              <Lock className="size-[18px]" />
              Pay {inr(payable)} securely
            </>
          )}
        </Button>

        <p className="flex items-center justify-center gap-2 text-[12.5px] text-navy-400">
          <Lock className="size-3.5" />
          Encrypted · Card details never reach our servers · Full refund until the e-stamp is procured
        </p>
      </div>
    </>
  );
}
