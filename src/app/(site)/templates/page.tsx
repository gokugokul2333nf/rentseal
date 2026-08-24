import type { Metadata } from "next";
import { ArrowRight, LayoutGrid } from "lucide-react";
import { BreadcrumbSchema, PageHero } from "@/components/site/page-hero";
import { TemplateLibrary } from "@/components/landing/template-library";
import { ButtonLink } from "@/components/ui/button";
import { LEAD_ANCHOR, SITE } from "@/lib/site";
import { TEMPLATES } from "@/lib/templates";

const title = `${TEMPLATES.length} Rental & Lease Agreement Templates — Tamil Nadu`;
const description = `Browse ${TEMPLATES.length} Tamil Nadu compliant agreement templates across residential, commercial, lease and leave-and-licence instruments. Each one is drafted, e-stamped and Aadhaar e-signed.`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/templates" },
  openGraph: { title, description },
};

const CRUMBS = [{ label: "Home", href: "/" }, { label: "Templates" }];

export default function TemplatesPage() {
  return (
    <>
      <PageHero
        eyebrow="Template library"
        icon={LayoutGrid}
        crumbs={CRUMBS}
        title={`${TEMPLATES.length} templates, built on four instruments`}
        body="Every template here is a Tamil Nadu compliant draft. Pick the situation that matches yours and the right clauses come with it — you are never starting from a blank page or a generic download."
      >
        <ButtonLink href={LEAD_ANCHOR} size="lg" className="group">
          Start my order
          <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
        </ButtonLink>
      </PageHero>

      <TemplateLibrary heading={false} />

      <BreadcrumbSchema crumbs={CRUMBS} baseUrl={SITE.url} />
    </>
  );
}
