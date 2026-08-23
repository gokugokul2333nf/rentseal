import type { Metadata } from "next";
import { Building2, Heart, Lock, Scale, ShieldCheck, Users } from "lucide-react";
import { BreadcrumbSchema, PageHero } from "@/components/site/page-hero";
import { TrustBar } from "@/components/landing/trust-bar";
import { Testimonials } from "@/components/landing/testimonials";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/motion";
import { SectionHeading } from "@/components/ui/section-heading";
import { LEAD_ANCHOR, SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Us — Legal Documents Ordinary People Can Read",
  description:
    "RentSeal builds rental agreements for Tamil Nadu that are legally sound and written in plain English. Registered in Chennai, serving all 38 districts.",
  alternates: { canonical: "/about" },
};

const CRUMBS = [{ label: "Home", href: "/" }, { label: "About" }];

const VALUES = [
  {
    icon: Scale,
    title: "The government's rate is the government's rate",
    body: "We do not mark up stamp duty, not by a rupee. It appears as its own line on every invoice, and if the Registration Department debits less than we collected, we refund the difference automatically.",
  },
  {
    icon: Heart,
    title: "Plain English is not dumbing down",
    body: "A clause you cannot read is a clause you cannot rely on. Every sentence in our templates has been rewritten until an ordinary person can follow it — without losing a word of legal effect.",
  },
  {
    icon: ShieldCheck,
    title: "We will talk you out of a sale",
    body: "If an 11-month agreement does what you need, we will say so rather than sell you registration. Support is measured on questions resolved, not on conversions.",
  },
  {
    icon: Lock,
    title: "Your Aadhaar is not our asset",
    body: "Identity numbers are encrypted at rest, masked everywhere in the interface, never written to a log, and never sold or shared. Only the last four digits ever reach the document.",
  },
];

const TIMELINE = [
  {
    year: "2021",
    title: "Started in a Chennai living room",
    body: "Two founders — one an advocate practising at the Madras High Court, one an engineer — after a friend lost a ₹2,00,000 deposit over an agreement that was never stamped.",
  },
  {
    year: "2022",
    title: "e-Stamping integrated",
    body: "The moment stamp paper stopped being something our customers had to chase, volumes tripled. We stopped charging for it separately and passed it through at cost.",
  },
  {
    year: "2023",
    title: "Aadhaar e-Sign, and the last office visit disappeared",
    body: "For 11-month agreements the entire journey became remote. A landlord in Salem and a tenant in Chennai could sign the same document within an hour.",
  },
  {
    year: "2024",
    title: "Advocate verification at scale",
    body: "A panel of advocates enrolled with the Bar Council of Tamil Nadu now reviews Premium agreements within 24 hours, catching the one-sided clauses that templates copy blindly.",
  },
  {
    year: "2026",
    title: "All 38 districts, 42,800 agreements",
    body: "From Chennai to Kanyakumari. Two-thirds are created on a phone, and the median time from first field to signed PDF is under nine minutes.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About RentSeal"
        icon={Building2}
        crumbs={CRUMBS}
        title="We started this because a friend lost his deposit over an unstamped agreement"
        body="₹2,00,000, gone, because a document downloaded from the internet was never stamped and could not be produced in evidence. Everything we have built since is aimed at making sure that doesn't happen to anyone else in Tamil Nadu."
      >
        <ButtonLink href={LEAD_ANCHOR} size="lg">
          Request a call back
        </ButtonLink>
      </PageHero>

      <TrustBar />

      {/* Values */}
      <section className="section">
        <div className="container-page">
          <SectionHeading
            eyebrow="What we hold to"
            icon={Heart}
            title="Four positions we won't trade away"
            body="Legal technology gets a bad name when it optimises for conversion over the customer's actual interest. These are the guardrails."
          />

          <Stagger className="mt-16 grid gap-5 md:grid-cols-2" amount={0.1}>
            {VALUES.map((value) => (
              <StaggerItem key={value.title}>
                <Card className="h-full p-7">
                  <span className="grid size-11 place-items-center rounded-xl bg-navy-950 text-white">
                    <value.icon className="size-5" />
                  </span>
                  <h3 className="mt-5 font-display text-[17.5px] font-bold text-navy-950">
                    {value.title}
                  </h3>
                  <p className="mt-2.5 text-[14.5px] leading-[1.75] text-navy-600">{value.body}</p>
                </Card>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Timeline */}
      <section className="section border-y border-line bg-white">
        <div className="container-page">
          <SectionHeading eyebrow="How we got here" title="Five years, one problem" />

          <div className="mx-auto mt-16 max-w-3xl">
            <ol className="space-y-8">
              {TIMELINE.map((item, i) => (
                <Reveal key={item.year} delay={i * 0.06}>
                  <li className="relative border-l-2 border-line pl-8 pb-2">
                    <span className="absolute -top-0.5 -left-[13px] size-6 rounded-full border-[5px] border-white bg-brand-600" />
                    <p className="tnum font-display text-[13px] font-extrabold tracking-wide text-brand-700">
                      {item.year}
                    </p>
                    <h3 className="mt-1 font-display text-[18px] font-bold text-navy-950">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-[14.5px] leading-[1.75] text-navy-600">{item.body}</p>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Company facts */}
      <section className="section">
        <div className="container-page">
          <SectionHeading
            eyebrow="The legal bit"
            icon={Users}
            title="Who you are actually dealing with"
            body="A technology company, not a law firm. We say so plainly because the difference matters."
          />

          <Reveal delay={0.12}>
            <div className="mx-auto mt-14 max-w-3xl overflow-hidden rounded-2xl border border-line bg-white">
              <dl className="divide-y divide-line">
                {[
                  ["Registered name", SITE.legalName],
                  ["CIN", SITE.cin],
                  ["GSTIN", SITE.gstin],
                  ["Registered office", SITE.address],
                  ["Advocate panel", "Enrolled with the Bar Council of Tamil Nadu"],
                  ["Infrastructure", "ISO 27001 certified, hosted in the ap-south-1 region"],
                  ["Payments", "PCI-DSS compliant gateway; we never store card data"],
                ].map(([label, value]) => (
                  <div key={label} className="grid gap-1 px-6 py-4 sm:grid-cols-[200px_1fr] sm:gap-4">
                    <dt className="text-[13.5px] font-semibold text-navy-500">{label}</dt>
                    <dd className="text-[14.5px] text-navy-900">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="mx-auto mt-8 max-w-3xl rounded-2xl border border-line bg-canvas p-6 text-[14px] leading-[1.75] text-navy-600">
              <strong className="font-semibold text-navy-950">To be completely clear:</strong>{" "}
              RentSeal is a technology platform. We do not practise law and we do not represent
              you in a dispute. Advocate verification on the Premium plan is rendered by
              independent advocates enrolled with the Bar Council of Tamil Nadu, who are
              responsible for their own professional opinion. If your matter needs
              representation, we will tell you and point you toward it.
            </p>
          </Reveal>
        </div>
      </section>

      <Testimonials />

      <BreadcrumbSchema crumbs={CRUMBS} baseUrl={SITE.url} />
    </>
  );
}
