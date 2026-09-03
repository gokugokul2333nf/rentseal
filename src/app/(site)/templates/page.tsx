import type { Metadata } from "next";
import { BreadcrumbSchema } from "@/components/site/page-hero";
import { TemplateCatalogue } from "@/components/landing/template-catalogue";
import { SITE } from "@/lib/site";
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
      <TemplateCatalogue />
      <BreadcrumbSchema crumbs={CRUMBS} baseUrl={SITE.url} />
    </>
  );
}
