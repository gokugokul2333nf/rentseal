import type { Metadata } from "next";
import { SuccessView } from "@/components/success/success-view";

export const metadata: Metadata = {
  title: "Agreement Received",
  description: "Your draft is with our team. We will call to confirm the details and take payment.",
  robots: { index: false, follow: false },
};

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;
  return <SuccessView agreementId={id ?? "LP-2026-000000"} />;
}
