import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AGREEMENT_TYPES } from "@/lib/site";
import { AgreementProvider } from "@/lib/agreement-store";
import { BuilderShell } from "@/components/builder/builder-shell";
import { isTemplateId, TEMPLATE_IDS, TEMPLATE_SPECS } from "@/lib/agreement-templates";
import { TEMPLATES } from "@/lib/templates";
import type { AgreementType } from "@/lib/types";

/**
 * One drafting URL per template, plus the four bare instruments.
 *
 * /create/commercial opens a commercial letting and leaves the choice of which
 * kind to the picker; /create/warehouse-rental opens the warehouse deed
 * outright. Both are needed — the first is where somebody browsing lands, and
 * the second is what the template library links to, because a card that says
 * "Draft this" has to draft that one and not a generic cousin of it.
 */
export function generateStaticParams() {
  return [
    ...AGREEMENT_TYPES.map((t) => ({ type: t.id })),
    ...TEMPLATE_IDS.map((id) => ({ type: id })),
  ];
}

/** Resolves a route param that may name either a template or an instrument. */
function resolve(type: string) {
  if (isTemplateId(type)) {
    const spec = TEMPLATE_SPECS[type];
    const listed = TEMPLATES.find((t) => t.id === type);
    return {
      templateId: spec.id,
      baseType: spec.baseType,
      name: listed?.name ?? spec.deedTitle,
      description: listed?.description,
    };
  }
  const meta = AGREEMENT_TYPES.find((t) => t.id === type);
  if (!meta) return null;
  return {
    templateId: undefined,
    baseType: meta.id,
    name: meta.name,
    description: meta.description,
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ type: string }>;
}): Promise<Metadata> {
  const { type } = await params;
  const found = resolve(type);
  return {
    title: found ? `Create a ${found.name}` : "Create an Agreement",
    description: found?.description,
    robots: { index: false, follow: true },
  };
}

export default async function BuilderPage({ params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;
  const found = resolve(type);
  if (!found) notFound();

  const baseType = found.baseType as AgreementType;

  return (
    // templateId is deliberately left undefined on the instrument routes: it
    // marks a template as authoritative, and /create/commercial should let a
    // saved warehouse draft survive rather than reset it to a shop.
    <AgreementProvider initialType={baseType} initialTemplateId={found.templateId}>
      <BuilderShell type={baseType} />
    </AgreementProvider>
  );
}
