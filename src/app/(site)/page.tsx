import type { Metadata } from "next";
import { AgreementTypes } from "@/components/landing/agreement-types";
import { TemplateLibrary } from "@/components/landing/template-library";
import { Cities } from "@/components/landing/cities";
import { LeadForm } from "@/components/landing/lead-form";
import { Comparison } from "@/components/landing/comparison";
import { FaqSchema, FaqSection } from "@/components/landing/faq-section";
import { Features } from "@/components/landing/features";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { PricingCards } from "@/components/landing/pricing-cards";
import { StampPaper } from "@/components/landing/stamp-paper";
import { Testimonials } from "@/components/landing/testimonials";
import { TrustBar } from "@/components/landing/trust-bar";
import { SITE } from "@/lib/site";
import { DENOMINATIONS } from "@/lib/stamp-paper";

export const metadata: Metadata = {
  title: "Stamp Paper Delivery & Rental Agreements Across Tamil Nadu",
  description: SITE.description,
  alternates: { canonical: "/" },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Stamp paper supply, delivery and rental agreement drafting",
  provider: { "@id": `${SITE.url}/#organization` },
  areaServed: { "@type": "State", name: "Tamil Nadu" },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Stamp paper and agreement services",
    itemListElement: [
      ...DENOMINATIONS.filter((d) => d.value > 0).map((d) => ({
        "@type": "Offer",
        name: `${d.label} non-judicial stamp paper`,
        price: String(d.value),
        priceCurrency: "INR",
      })),
      { "@type": "Offer", name: "Rental agreement — Basic", price: "349", priceCurrency: "INR" },
      { "@type": "Offer", name: "Rental agreement — Standard", price: "799", priceCurrency: "INR" },
      { "@type": "Offer", name: "Rental agreement — Premium", price: "1499", priceCurrency: "INR" },
    ],
  },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustBar />
      <StampPaper />
      <Cities />
      <LeadForm />
      <AgreementTypes />
      <TemplateLibrary />
      <HowItWorks />
      <Features />
      <Comparison />
      <PricingCards />
      <Testimonials />
      <FaqSection limit={10} />

      <FaqSchema limit={8} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
    </>
  );
}
