import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from "@/lib/og";

export const alt = "RentSeal — stamp paper and rental agreements across Tamil Nadu";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return ogImage({
    eyebrow: "All 38 districts of Tamil Nadu",
    title: "Stamp paper and rental agreements, delivered",
    facts: ["e-Stamped at government rate", "Aadhaar e-Sign", "Same day in Chennai"],
  });
}
