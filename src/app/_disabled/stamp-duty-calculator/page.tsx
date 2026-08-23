import type { Metadata } from "next";
import { Calculator } from "lucide-react";
import { BreadcrumbSchema, PageHero } from "@/components/site/page-hero";
import { StampDutyCalculator } from "@/components/tools/stamp-duty-calculator";
import { Accordion } from "@/components/ui/accordion";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/motion";
import { FAQS, SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Stamp Duty Calculator for Rental Agreements in Tamil Nadu",
  description:
    "Calculate the exact stamp duty and registration fee for a rental or lease agreement in Tamil Nadu. 1% of total rent plus deposit, shown line by line with no markup.",
  alternates: { canonical: "/stamp-duty-calculator" },
  openGraph: {
    title: "Tamil Nadu Stamp Duty Calculator — Rental Agreements",
    description:
      "Enter your rent, deposit and term. See the duty, the registration fee and our fee itemised before you pay a rupee.",
  },
};

const CRUMBS = [{ label: "Home", href: "/" }, { label: "Stamp Duty Calculator" }];

const DUTY_FAQS = FAQS.filter((f) => f.category === "Stamp duty");

export default function CalculatorPage() {
  return (
    <>
      <PageHero
        eyebrow="Free tool"
        icon={Calculator}
        crumbs={CRUMBS}
        title="Tamil Nadu stamp duty calculator"
        body="Stamp duty on a rental agreement in Tamil Nadu is 1% of the total rent over the term plus the deposit. Put your numbers in and watch the arithmetic — the same figures appear on your invoice, unchanged."
      />

      <section className="section">
        <div className="container-page">
          <StampDutyCalculator />
        </div>
      </section>

      <section className="section border-t border-line bg-white">
        <div className="container-page">
          <SectionHeading
            eyebrow="The rules behind the maths"
            title="Where these numbers come from"
            body="No estimates, no rules of thumb — every figure traces to a specific provision."
          />

          <Reveal delay={0.1} className="mx-auto mt-14 max-w-3xl">
            <div className="space-y-4">
              {[
                {
                  head: "Article 35, Indian Stamp Act 1899 (as applicable in Tamil Nadu)",
                  body: "For a lease of less than 30 years, duty is chargeable on the aggregate of the rent payable over the whole term plus any advance, premium or deposit paid. Tamil Nadu levies this at 1%.",
                },
                {
                  head: "Section 17(1)(d), Registration Act 1908",
                  body: "A lease of immovable property from year to year, or for a term exceeding one year, must be registered. A term of 11 months therefore falls outside compulsory registration — the reason it became the Tamil Nadu default.",
                },
                {
                  head: "Registration fee — 1% of the same chargeable value",
                  body: "Where registration applies, the Registration Department levies a further 1%. This is a separate head from stamp duty and appears as its own line on your invoice.",
                },
                {
                  head: "Tamil Nadu Regulation of Rights and Responsibilities of Landlords and Tenants Act, 2017",
                  body: "Requires every tenancy agreement to be reduced to writing and, since 2019, to be intimated to the Rent Authority. Our templates are drafted to comply.",
                },
                {
                  head: "GST at 18% — on our service fee only",
                  body: "A statutory levy paid to the government is not a supply of service by us, so GST is charged on the platform and advocate fees alone. You can verify this on the tax invoice.",
                },
              ].map((item) => (
                <div key={item.head} className="rounded-2xl border border-line bg-canvas p-6">
                  <h3 className="font-display text-[15.5px] font-bold text-navy-950">{item.head}</h3>
                  <p className="mt-2 text-[14.5px] leading-[1.7] text-navy-600">{item.body}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container-page">
          <SectionHeading title="Stamp duty questions" />
          <Reveal delay={0.1} className="mx-auto mt-12 max-w-3xl">
            <Accordion items={DUTY_FAQS} defaultOpen={0} />
          </Reveal>
        </div>
      </section>

      <BreadcrumbSchema crumbs={CRUMBS} baseUrl={SITE.url} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: DUTY_FAQS.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }),
        }}
      />
    </>
  );
}
