"use client";

import { useState } from "react";
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  FileCheck2,
  Lock,
  Phone,
  Receipt,
} from "lucide-react";
import { useAgreement } from "@/lib/agreement-store";
import { PLANS, SITE } from "@/lib/site";
import { agreementRow } from "@/lib/orders";
import { checkPincode } from "@/lib/pincode";
import { calculateStampDuty, splitGovernmentAndService } from "@/lib/stamp-duty";
import { Button, ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/card";
import { Field, Textarea } from "@/components/ui/field";
import { AgreementDocument } from "./agreement-document";
import { StepIntro } from "./steps";
import { cn, formatDate, inr } from "@/lib/utils";
import type { PlanId } from "@/lib/types";

/* ═════════════════ 6. Review and send ═════════════════ */

export function ReviewAndSendStep({ onSent }: { onSent: () => void }) {
  const { draft } = useAgreement();
  const [sending, setSending] = useState(false);
  const [failed, setFailed] = useState("");
  const [notes, setNotes] = useState("");

  const missing: string[] = [];
  if (!draft.landlord.fullName) missing.push("Landlord's full name");
  if (!draft.tenant.fullName) missing.push("Tenant's full name");
  if (!draft.property.doorNo && !draft.property.street) missing.push("Property address");
  if (!draft.terms.monthlyRent) missing.push("Monthly rent");
  if (!draft.terms.securityDeposit) missing.push("Security deposit");
  if (!draft.landlord.phone) missing.push("Landlord's mobile number");
  if (!draft.tenant.phone) missing.push("Tenant's mobile number");
  // A wrong PIN is worse than a blank one — it looks filled in, and it is what
  // the rider goes by.
  const pin = checkPincode(draft.property.pincode, draft.property.district);
  if (pin.status === "empty") missing.push("PIN code");
  else if (pin.status !== "ok") missing.push(`PIN code — ${pin.message}`);

  return (
    <>
      <StepIntro
        title="Read it, then send it to us"
        body="This is the exact document that will be stamped and signed. Nothing is charged here — we read it, ring you to confirm, take payment on that call, and then stamp and deliver."
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
                The gaps show as shaded blanks in the document below. You can send it as it
                stands and fill these in on the call, but the agreement is not valid until they
                are filled.
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
      </div>

      <div className="scroll-slim max-h-[70vh] overflow-y-auto rounded-b-2xl border border-line bg-white p-6 shadow-soft sm:p-10">
        <AgreementDocument draft={draft} animate={false} />
      </div>

      <SendBlock
        onSent={onSent}
        sending={sending}
        setSending={setSending}
        failed={failed}
        setFailed={setFailed}
        notes={notes}
        setNotes={setNotes}
      />
    </>
  );
}

function SendBlock({
  onSent,
  sending,
  setSending,
  failed,
  setFailed,
  notes,
  setNotes,
}: {
  onSent: () => void;
  sending: boolean;
  setSending: (v: boolean) => void;
  failed: string;
  setFailed: (v: string) => void;
  notes: string;
  setNotes: (v: string) => void;
}) {
  const { draft, setPlan, update } = useAgreement();

  const breakdown = calculateStampDuty({
    monthlyRent: parseFloat(draft.terms.monthlyRent || "0"),
    securityDeposit: parseFloat(draft.terms.securityDeposit || "0"),
    durationMonths: draft.terms.durationMonths,
    plan: draft.plan,
    registerAnyway: draft.options.registrationRequired,
    lawyerReview: draft.options.lawyerReview,
  });
  const split = splitGovernmentAndService(breakdown);

  const contact = draft.landlord.phone ? draft.landlord : draft.tenant;
  const canSend = contact.phone.replace(/\D/g, "").length >= 10;

  const send = async () => {
    setSending(true);
    setFailed("");
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...agreementRow(draft, notes), draft }),
      });
      if (!response.ok) throw new Error(String(response.status));
      onSent();
    } catch {
      // Never claim it landed. An order that quietly failed to reach the sheet
      // is an order nobody will ever call about.
      setFailed(
        "We could not send that just now. Please call or WhatsApp us and we will take it down — your draft is safe on this device.",
      );
      setSending(false);
    }
  };

  return (
    <div className="mt-8 space-y-6 border-t border-line pt-8">
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
                  <p className="tnum mt-1.5 text-[19px] font-bold text-navy-950">
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
                <span className="text-[14px] font-semibold text-navy-900">
                  Add notary attestation
                </span>
                <span className="mt-0.5 block text-[12.5px] text-navy-500">
                  A notary public attests the signatures on your agreement once both
                  parties have signed.
                </span>
              </span>
            </label>
          ) : null}
        </div>

        {/* Quote */}
        <div className="overflow-hidden rounded-2xl border border-line bg-white">
          <div className="flex items-center gap-2 border-b border-line bg-navy-50 px-5 py-3">
            <Receipt className="size-4 text-navy-500" />
            <h3 className="text-[13px] font-bold text-navy-950">
              What it will come to
            </h3>
          </div>
          <dl className="divide-y divide-line">
            {[
              { label: "Stamp duty", value: breakdown.stampDuty, hint: "1% · Govt of TN" },
              breakdown.registrationRequired
                ? { label: "Registration fee", value: breakdown.registrationFee, hint: "1% · Govt of TN" }
                : null,
              { label: "Platform fee", value: breakdown.platformFee, hint: "LP Stamp Paper" },
              breakdown.lawyerFee > 0
                ? { label: "Notary attestation", value: breakdown.lawyerFee, hint: "Notary public" }
                : null,
              { label: "GST", value: breakdown.gst, hint: "18% on our fee" },
            ]
              .filter(Boolean)
              .map((row) => {
                const r = row as { label: string; value: number; hint: string };
                return (
                  <div key={r.label} className="flex items-start justify-between px-5 py-3">
                    <dt className="text-[13.5px] text-navy-600">
                      {r.label}
                      <span className="block text-[11.5px] text-navy-400">{r.hint}</span>
                    </dt>
                    <dd className="tnum text-[14px] font-semibold text-navy-950">{inr(r.value)}</dd>
                  </div>
                );
              })}
            <div className="flex items-center justify-between bg-navy-950 px-5 py-4">
              <dt className="text-[13.5px] font-semibold text-white/70">Estimate</dt>
              <dd className="tnum font-display text-[21px] font-bold text-white">
                {inr(breakdown.total)}
              </dd>
            </div>
          </dl>
        </div>

        <p className="text-[12.5px] leading-relaxed text-navy-400">
          Of this, {inr(split.government)} goes to the Government of Tamil Nadu and{" "}
          {inr(split.service)} to us. We will confirm the final figure on the call before you
          pay anything.
        </p>

        {/* Who we call */}
        <div className="rounded-2xl border border-line bg-white p-5">
          <h3 className="flex items-center gap-2 text-[14px] font-bold text-navy-950">
            <Phone className="size-4 text-navy-500" />
            We will call this number
          </h3>
          {canSend ? (
            <p className="mt-2 text-[13.5px] text-navy-600">
              <span className="font-semibold text-navy-950">
                {contact.fullName || "Your contact"}
              </span>{" "}
              on <span className="tnum font-semibold text-navy-950">{contact.phone}</span> — from
              the {contact === draft.landlord ? "landlord" : "tenant"} details you entered. Go
              back a step to change it.
            </p>
          ) : (
            <p className="mt-2 flex items-start gap-2 text-[13.5px] text-amber-700">
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              Add a ten-digit mobile number for the landlord or the tenant before sending — it is
              how we reach you to confirm.
            </p>
          )}
        </div>

        <Field label="Anything we should know?" hint="Optional">
          {(id) => (
            <Textarea
              id={id}
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. tenant moves in on the 1st, please call after 6pm"
            />
          )}
        </Field>

        {failed ? (
          <div className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4">
            <AlertCircle className="mt-0.5 size-4 shrink-0 text-rose-600" />
            <div className="min-w-0">
              <p className="text-[13px] leading-relaxed text-rose-800">{failed}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <ButtonLink href={`tel:${SITE.phone.replace(/\s/g, "")}`} variant="secondary" size="sm">
                  Call {SITE.phone}
                </ButtonLink>
                <ButtonLink
                  href={`https://wa.me/${SITE.whatsapp.replace(/\D/g, "")}`}
                  variant="secondary"
                  size="sm"
                >
                  WhatsApp us
                </ButtonLink>
              </div>
            </div>
          </div>
        ) : null}

        <Button size="xl" fullWidth onClick={send} disabled={sending || !canSend}>
          {sending ? (
            <>
              <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Sending…
            </>
          ) : (
            <>
              Send my agreement
              <ArrowRight className="size-[18px]" />
            </>
          )}
        </Button>

        <p className="flex items-center justify-center gap-2 text-center text-[12.5px] text-navy-400">
          <Lock className="size-3.5 shrink-0" />
          No payment is taken on this site. We call to confirm before anything is charged.
        </p>
    </div>
  );
}
