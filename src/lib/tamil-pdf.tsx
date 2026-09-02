import path from "node:path";
import { Document, Font, Page, StyleSheet, Text, View, renderToBuffer } from "@react-pdf/renderer";
import { TAMIL_TEMPLATES, type TamilTemplateId } from "./tamil-templates";
import { SITE } from "./site";

/**
 * The Tamil deeds as PDFs.
 *
 * Tamil needs a shaping engine — the vowel signs ெ ே ை are written before the
 * consonant they belong to and have to be reordered, and conjuncts have to be
 * formed. @react-pdf does this correctly through fontkit, verified against a
 * rendered page rather than assumed; the standard PDF fonts carry no Tamil at
 * all, so a font has to be embedded.
 *
 * Noto Sans Tamil is used because it is under the SIL Open Font License and
 * can be redistributed with the app. The licence travels with it in
 * src/lib/fonts/.
 */

const FONT_DIR = path.join(process.cwd(), "src", "lib", "fonts");

Font.register({
  family: "NotoSansTamil",
  fonts: [
    { src: path.join(FONT_DIR, "NotoSansTamil-Regular.ttf"), fontWeight: "normal" },
    { src: path.join(FONT_DIR, "NotoSansTamil-Bold.ttf"), fontWeight: "bold" },
  ],
});

// Tamil has no hyphenation rules worth applying, and the default English
// hyphenator breaks words mid-syllable.
Font.registerHyphenationCallback((word) => [word]);

const A4_HEIGHT = 841.89;
const FIRST_PAGE_TOP_IN = 4.5;
const PAGE_PADDING_TOP = 48;

const s = StyleSheet.create({
  page: {
    paddingTop: PAGE_PADDING_TOP,
    paddingBottom: 104,
    paddingHorizontal: 56,
    fontFamily: "NotoSansTamil",
    fontSize: 10.5,
    lineHeight: 1.75,
    color: "#111111",
  },
  heading: {
    fontWeight: "bold",
    fontSize: 12.5,
    textAlign: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  para: { marginBottom: 8, textAlign: "justify" },
  footSigLeft: {
    position: "absolute",
    top: A4_HEIGHT - 78,
    left: 56,
    width: "40%",
    borderTopWidth: 0.6,
    borderTopColor: "#666666",
    paddingTop: 3,
    fontWeight: "bold",
    fontSize: 8,
  },
  footSigRight: {
    position: "absolute",
    top: A4_HEIGHT - 78,
    right: 56,
    width: "40%",
    borderTopWidth: 0.6,
    borderTopColor: "#666666",
    paddingTop: 3,
    textAlign: "right",
    fontWeight: "bold",
    fontSize: 8,
  },
  footMeta: {
    position: "absolute",
    top: A4_HEIGHT - 42,
    left: 56,
    right: 56,
    fontSize: 7.5,
    color: "#888888",
    textAlign: "center",
    borderTopWidth: 0.5,
    borderTopColor: "#DDDDDD",
    paddingTop: 5,
  },
});

export function TamilDeed({ id, reference }: { id: TamilTemplateId; reference: string }) {
  const t = TAMIL_TEMPLATES[id];
  return (
    <Document title={`${t.nameTa} — ${reference}`} author={SITE.legalName} subject={t.nameEn}>
      <Page size="A4" style={s.page}>
        {/* Clears the stamp paper's pre-printed header. First page only. */}
        <View style={{ height: FIRST_PAGE_TOP_IN * 72 - PAGE_PADDING_TOP }} />

        {t.body.map((block, i) => (
          <Text key={i} style={block.heading ? s.heading : s.para}>
            {block.text}
          </Text>
        ))}

        {/* Both sides sign every page, so no sheet can be swapped afterwards. */}
        <Text style={s.footSigLeft} fixed>
          {t.roleA} — கையொப்பம்
        </Text>
        {t.roleB ? (
          <Text style={s.footSigRight} fixed>
            {t.roleB} — கையொப்பம்
          </Text>
        ) : null}
        <Text
          style={s.footMeta}
          render={({ pageNumber, totalPages }) =>
            `${reference}  ·  ${SITE.name}  ·  பக்கம் ${pageNumber} / ${totalPages}`
          }
          fixed
        />
      </Page>
    </Document>
  );
}

export async function renderTamilDeed(id: TamilTemplateId, reference: string): Promise<Buffer> {
  return renderToBuffer(<TamilDeed id={id} reference={reference} />);
}
