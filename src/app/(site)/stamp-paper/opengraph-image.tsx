import { DISTRICTS } from "@/lib/districts";
import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from "@/lib/og";

export const alt = "Stamp paper delivered to all 38 districts of Tamil Nadu";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return ogImage({
    eyebrow: "District-wise delivery",
    title: "Stamp paper delivered across Tamil Nadu",
    facts: [`All ${DISTRICTS.length} districts`, "₹20 – ₹500 + e-Stamp", "Face value, no markup"],
  });
}
