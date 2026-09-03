import type { Metadata } from "next";
import { ArrowRight, Stamp } from "lucide-react";
import { BreadcrumbSchema, PageHero } from "@/components/site/page-hero";
import { DistrictIndex } from "@/components/site/district-index";
import { StampPaperHow } from "@/components/site/stamp-paper-how";
import { ButtonLink } from "@/components/ui/button";
import { DISTRICTS } from "@/lib/districts";
import { LEAD_ANCHOR, SITE } from "@/lib/site";

const title = "Government Authorised Stamp Paper — Tamil Nadu";
const description =
  "Genuine, government authorised stamp paper delivered to your door anywhere in Tamil Nadu. ₹20 to ₹500 and e-Stamps for any value, at face value, same day in Chennai.";

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
        title="Government authorised stamp paper, delivered to your doorstep"
        body="Fill in the details online and receive genuine, government authorised stamp paper delivered to your door — legally valid, at exactly the printed value, with a flat delivery charge stated before you confirm. Same day in the Chennai metro, next working day in the major cities, two to three days everywhere else."
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <ButtonLink href={LEAD_ANCHOR} size="lg" className="group">
            Get started
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </ButtonLink>
          <ButtonLink href="/rental-agreement" variant="secondary" size="lg">
            Get the agreement drafted too
          </ButtonLink>
        </div>
      </PageHero>

      <StampPaperHow />

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
