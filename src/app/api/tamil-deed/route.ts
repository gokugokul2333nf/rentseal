import { NextResponse } from "next/server";
import { renderTamilDeed } from "@/lib/tamil-pdf";
import { isTamilTemplateId, TAMIL_TEMPLATES } from "@/lib/tamil-templates";
import { newDraftId } from "@/lib/draft";

/**
 * A Tamil deed as a blank PDF, ready to print onto stamp paper.
 *
 * These sixteen are not drafted from a form the way the English templates are:
 * they carry their own blanks and the counter fills them in by hand, which is
 * how the office has always worked. So this hands back the deed itself rather
 * than asking a customer to answer questions first.
 */
export const runtime = "nodejs";

export async function GET(request: Request) {
  const id = new URL(request.url).searchParams.get("template") ?? "";
  if (!isTamilTemplateId(id)) {
    return NextResponse.json(
      { error: "Unknown template.", templates: Object.keys(TAMIL_TEMPLATES) },
      { status: 404 },
    );
  }
  const reference = newDraftId();
  const buf = await renderTamilDeed(id, reference);
  return new NextResponse(new Uint8Array(buf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${id}-${reference}.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}
