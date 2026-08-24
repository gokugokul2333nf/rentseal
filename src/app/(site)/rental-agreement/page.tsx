import type { Metadata } from "next";
import { ArrowRight, FileStack } from "lucide-react";
import { BreadcrumbSchema, PageHero } from "@/components/site/page-hero";
import { DistrictIndex } from "@/components/site/district-index";
import { ButtonLink } from "@/components/ui/button";
import { DISTRICTS } from "@/lib/districts";
import { LEAD_ANCHOR, SITE } from "@/lib/site";

const title = "Rental Agreement in Tamil Nadu — All 38 Districts";
const description =
  "Create a legally valid rental agreement anywhere in Tamil Nadu. E-stamped at the government rate, Aadhaar e-signed and delivered by email and WhatsApp. Pick your district for local Sub-Registrar Offices and delivery times.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/rental-agreement" },
  openGraph: { title, description },
};

const crumbs = [{ label: "Home", href: "/" }, { label: "Rental agreement" }];

export default function RentalAgreementIndex() {
  return (
    <>
      <PageHero
        eyebrow="District-wise coverage"
        icon={FileStack}
        crumbs={crumbs}
        title="Rental agreements, district by district across Tamil Nadu"
        body={`We draft, e-stamp and e-sign rental agreements in all ${DISTRICTS.length} districts of the state. Each district page carries its own Sub-Registrar Offices, the towns we deliver to, and the delivery promise that applies there.`}
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <ButtonLink href={LEAD_ANCHOR} size="lg" className="group">
            Start my agreement
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </ButtonLink>
          <ButtonLink href="/stamp-paper" variant="secondary" size="lg">
            Order stamp paper only
          </ButtonLink>
        </div>
      </PageHero>

      <DistrictIndex base="rental-agreement" noun="Rental agreements" />

      <BreadcrumbSchema crumbs={crumbs} baseUrl={SITE.url} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Rental agreement coverage by district — Tamil Nadu",
            numberOfItems: DISTRICTS.length,
            itemListElement: DISTRICTS.map((d, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: `Rental agreement in ${d.name}`,
              url: `${SITE.url}/rental-agreement/${d.slug}`,
            })),
          }),
        }}
      />
    </>
  );
}
