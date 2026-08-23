import type { Metadata } from "next";
import { SuccessView } from "@/components/success/success-view";

export const metadata: Metadata = {
  title: "Payment Confirmed",
  description: "Your rental agreement is being e-stamped and prepared for signature.",
  robots: { index: false, follow: false },
};

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;
  return <SuccessView agreementId={id ?? "RS-2026-000000"} />;
}
