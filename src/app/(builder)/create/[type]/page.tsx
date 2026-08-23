import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AGREEMENT_TYPES } from "@/lib/site";
import { AgreementProvider } from "@/lib/agreement-store";
import { BuilderShell } from "@/components/builder/builder-shell";
import type { AgreementType } from "@/lib/types";

export function generateStaticParams() {
  return AGREEMENT_TYPES.map((t) => ({ type: t.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ type: string }>;
}): Promise<Metadata> {
  const { type } = await params;
  const meta = AGREEMENT_TYPES.find((t) => t.id === type);
  return {
    title: meta ? `Create a ${meta.name}` : "Create an Agreement",
    description: meta?.description,
    robots: { index: false, follow: true },
  };
}

export default async function BuilderPage({ params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;
  const meta = AGREEMENT_TYPES.find((t) => t.id === type);
  if (!meta) notFound();

  return (
    <AgreementProvider initialType={meta.id as AgreementType}>
      <BuilderShell type={meta.id as AgreementType} />
    </AgreementProvider>
  );
}
