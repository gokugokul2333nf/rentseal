import type { Metadata } from "next";
import { ArrowRight, LayoutGrid } from "lucide-react";
import { BreadcrumbSchema, PageHero } from "@/components/site/page-hero";
import { TemplateLibrary } from "@/components/landing/template-library";
import { TamilTemplates } from "@/components/landing/tamil-templates";
import { ButtonLink } from "@/components/ui/button";
import { BUILDER_START, SITE } from "@/lib/site";
import { TEMPLATES } from "@/lib/templates";
import { TAMIL_TEMPLATE_IDS } from "@/lib/tamil-templates";

const title = `${TEMPLATES.length + TAMIL_TEMPLATE_IDS.length} Agreement Templates in English and Tamil — Tamil Nadu`;
const description = `Browse ${TEMPLATES.length} English templates across residential, commercial, lease, leave-and-licence and sale, plus ${TAMIL_TEMPLATE_IDS.length} Tamil deeds ready to print — rent, lease, loan, mortgage, sale, indemnity, affidavit and no-objection.`;

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
        title={`${TEMPLATES.length} English templates and ${TAMIL_TEMPLATE_IDS.length} Tamil deeds`}
        body="Every template here is a Tamil Nadu compliant draft. Pick the situation that matches yours and the right clauses come with it — you are never starting from a blank page or a generic download."
      >
        <ButtonLink href={BUILDER_START} size="lg" className="group">
          Start drafting
          <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
        </ButtonLink>
      </PageHero>

      <TemplateLibrary heading={false} />

      <TamilTemplates />

      <BreadcrumbSchema crumbs={CRUMBS} baseUrl={SITE.url} />
    </>
  );
}
