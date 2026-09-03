import type { Metadata } from "next";
import { ArrowRight, LayoutGrid } from "lucide-react";
import { BreadcrumbSchema, PageHero } from "@/components/site/page-hero";
import { TemplateLibrary } from "@/components/landing/template-library";
import { ButtonLink } from "@/components/ui/button";
import { BUILDER_START, SITE } from "@/lib/site";
import { TEMPLATES } from "@/lib/templates";
import { TAMIL_TEMPLATE_IDS } from "@/lib/tamil-templates";

/**
 * The Tamil deeds are inside TEMPLATES, not alongside it, so the total is the
 * length of the one list. Adding the two together billed the sixteen Tamil
 * deeds twice and advertised seventy-one documents where there are fifty-five.
 */
const ENGLISH_COUNT = TEMPLATES.length - TAMIL_TEMPLATE_IDS.length;

const title = `${TEMPLATES.length} Agreement and Deed Templates in English and Tamil — Tamil Nadu`;
const description = `Browse ${ENGLISH_COUNT} English templates across residential, commercial, lease, leave-and-licence, sale, business contracts, deeds and affidavits, plus ${TAMIL_TEMPLATE_IDS.length} Tamil deeds — rent, lease, loan, mortgage, sale, indemnity, affidavit and no-objection.`;

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
        title={`${ENGLISH_COUNT} English templates and ${TAMIL_TEMPLATE_IDS.length} Tamil deeds`}
        body="Every document here is a Tamil Nadu compliant draft — lettings, leases, sale deeds, business contracts, affidavits and the office’s own Tamil deeds. Pick the one that matches your situation and the right clauses come with it."
      >
        <ButtonLink href={BUILDER_START} size="lg" className="group">
          Create agreement
          <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
        </ButtonLink>
      </PageHero>

      <TemplateLibrary heading={false} />

      <BreadcrumbSchema crumbs={CRUMBS} baseUrl={SITE.url} />
    </>
  );
}
