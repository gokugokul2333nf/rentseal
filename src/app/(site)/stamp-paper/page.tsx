import type { Metadata } from "next";
import { ArrowRight, Stamp } from "lucide-react";
import { BreadcrumbSchema, PageHero } from "@/components/site/page-hero";
import { DistrictIndex } from "@/components/site/district-index";
import { ButtonLink } from "@/components/ui/button";
import { DISTRICTS } from "@/lib/districts";
import { LEAD_ANCHOR, SITE } from "@/lib/site";

const title = "Stamp Paper in Tamil Nadu — All 38 Districts";
const description =
  "Buy non-judicial stamp paper and e-Stamp certificates anywhere in Tamil Nadu at face value. ₹20 to ₹500 denominations plus e-Stamps for any value, delivered same day in the Chennai metro.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/stamp-paper" },
  openGraph: { title, description },
};

const crumbs = [{ label: "Home", href: "/" }, { label: "Stamp paper" }];

export default function StampPaperIndex() {
  return (
    <>
      <PageHero
        eyebrow="District-wise delivery"
        icon={Stamp}
        crumbs={crumbs}
        title="Stamp paper delivered to all 38 districts of Tamil Nadu"
        body="Licensed non-judicial paper and e-Stamp certificates at exactly the printed value, plus a flat delivery charge stated before you confirm. Same day in the Chennai metro, next working day in the major cities, two to three days everywhere else."
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <ButtonLink href={LEAD_ANCHOR} size="lg" className="group">
            Order stamp paper
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </ButtonLink>
          <ButtonLink href="/rental-agreement" variant="secondary" size="lg">
            Get the agreement drafted too
          </ButtonLink>
        </div>
      </PageHero>

      <DistrictIndex base="stamp-paper" noun="Stamp paper" />

      <BreadcrumbSchema crumbs={crumbs} baseUrl={SITE.url} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Stamp paper delivery by district — Tamil Nadu",
            numberOfItems: DISTRICTS.length,
            itemListElement: DISTRICTS.map((d, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: `Stamp paper in ${d.name}`,
              url: `${SITE.url}/stamp-paper/${d.slug}`,
            })),
          }),
        }}
      />
    </>
  );
}
