import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, BadgeCheck, Lock, Star } from "lucide-react";
import { LoginForm } from "@/components/auth/login-form";
import { Logo } from "@/components/ui/logo";
import { SITE, STATS } from "@/lib/site";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to RentSeal with a one-time password to see your agreements, drafts, invoices and renewals.",
  robots: { index: false, follow: true },
};

export default function LoginPage() {
  return (
    <main id="main" className="grid min-h-screen lg:grid-cols-[1fr_1.05fr]">
      {/* ── Form ─────────────────────────────────────────── */}
      <div className="relative flex flex-col justify-center overflow-hidden px-5 py-12 sm:px-10 lg:px-16">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-mesh opacity-60" />

        <div className="mx-auto w-full max-w-[400px]">
          <Link
            href="/"
            className="mb-10 inline-flex items-center gap-2 text-[13.5px] font-medium text-navy-500 transition-colors hover:text-navy-950"
          >
            <ArrowLeft className="size-4" />
            Back to RentSeal
          </Link>

          <Logo />

          <h1 className="mt-8 text-[clamp(1.8rem,4vw,2.35rem)] leading-[1.12] font-extrabold tracking-[-0.03em] text-navy-950">
            Sign in to your agreements
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-navy-500">
            No password to remember. We send a one-time code to your phone — the same number you
            used when you created the agreement.
          </p>

          <div className="mt-8">
            <LoginForm />
          </div>

          <p className="mt-8 text-[13px] leading-relaxed text-navy-400">
            By signing in you accept our{" "}
            <Link href="/legal/terms" className="font-medium text-navy-600 underline underline-offset-4">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/legal/privacy" className="font-medium text-navy-600 underline underline-offset-4">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>

      {/* ── Proof panel ──────────────────────────────────── */}
      <aside className="relative hidden overflow-hidden bg-navy-950 lg:flex lg:flex-col lg:justify-center">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-32 -right-24 size-[520px] rounded-full bg-brand-600/20 blur-[120px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-40 -left-24 size-[440px] rounded-full bg-emerald-500/12 blur-[120px]"
        />

        <div className="relative px-16 py-20">
          <blockquote>
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="size-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="mt-6 text-[22px] leading-[1.5] font-medium text-white">
              &ldquo;I used to lose a full morning at the Sub-Registrar office for every tenant.
              Did my last three agreements from my phone while the tenant sat in front of me.&rdquo;
            </p>
            <footer className="mt-7 flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-full bg-brand-600 text-[14px] font-bold text-white">
                LN
              </span>
              <div>
                <p className="flex items-center gap-1.5 text-[14.5px] font-bold text-white">
                  Lakshmi Narayanan
                  <BadgeCheck className="size-4 text-brand-400" />
                </p>
                <p className="text-[13px] text-white/50">Owns 4 flats · Adyar, Chennai</p>
              </div>
            </footer>
          </blockquote>

          <dl className="mt-16 grid grid-cols-2 gap-x-8 gap-y-8 border-t border-white/10 pt-12">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <dd className="font-display text-[28px] font-extrabold tracking-tight text-white">
                  {stat.value}
                </dd>
                <dt className="mt-1 text-[13.5px] font-medium text-white/60">{stat.label}</dt>
              </div>
            ))}
          </dl>

          <p className="mt-16 flex items-center gap-2 text-[12.5px] text-white/40">
            <Lock className="size-3.5" />
            Encrypted in transit and at rest · {SITE.legalName}
          </p>
        </div>
      </aside>
    </main>
  );
}
