import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  renderToBuffer,
} from "@react-pdf/renderer";
import {
  agreementTitle,
  generateClauses,
  propertyAddress,
  scheduleDescription,
} from "./clauses";
import { formatDate } from "./utils";
import { SITE } from "./site";
import type { AgreementDraft, Relation } from "./types";

/**
 * The agreement as a PDF, for the office rather than the customer.
 *
 * Built from the same `generateClauses` the on-screen document uses, so the two
 * cannot drift apart — the operator prints this onto stamp paper and couriers
 * it, and it has to be word for word what the customer approved.
 *
 * Rendered with @react-pdf/renderer rather than a headless browser on purpose:
 * Puppeteer needs a Chromium binary, which does not survive a serverless
 * deployment without a good deal of arranging.
 */

const RELATION: Record<Relation, string> = {
  son: "S/o",
  daughter: "D/o",
  wife: "W/o",
  husband: "H/o",
};

function pronoun(relation: Relation) {
  const female = relation === "daughter" || relation === "wife";
  return female ? { self: "herself", poss: "her" } : { self: "himself", poss: "his" };
}

/**
 * The PDF standard fonts have no rupee sign, so a ₹ renders as a broken glyph.
 * "Rs." is what an executed Tamil Nadu deed uses anyway — the sample reads
 * "Rs.12,000/-" — so this is closer to the template, not a compromise.
 */
const rupees = (text: string) => text.replace(/₹\s?/g, "Rs.");

/** Printed in full — the deed exists to identify the parties. */
function aadhaar(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits ? digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim() : "";
}

const s = StyleSheet.create({
  page: {
    paddingTop: 48,
    paddingBottom: 56,
    paddingHorizontal: 56,
    fontSize: 10.5,
    lineHeight: 1.6,
    fontFamily: "Times-Roman",
    color: "#111111",
  },
  title: {
    fontFamily: "Times-Bold",
    fontSize: 14,
    textAlign: "center",
    letterSpacing: 1.2,
    marginBottom: 18,
  },
  para: { marginBottom: 10, textAlign: "justify" },
  centreLabel: {
    fontFamily: "Times-Bold",
    fontSize: 10.5,
    textAlign: "center",
    letterSpacing: 1.5,
    marginBottom: 6,
    marginTop: 4,
  },
  witnesseth: {
    fontFamily: "Times-Bold",
    fontSize: 10.5,
    marginTop: 8,
    marginBottom: 10,
    letterSpacing: 0.4,
  },
  clauseRow: { flexDirection: "row", marginBottom: 9 },
  clauseNum: { width: 22, fontFamily: "Times-Bold" },
  clauseBody: { flex: 1, textAlign: "justify" },
  bold: { fontFamily: "Times-Bold" },
  scheduleHead: {
    fontFamily: "Times-Bold",
    fontSize: 11,
    textAlign: "center",
    letterSpacing: 1,
    marginTop: 18,
    marginBottom: 8,
  },
  signRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 46 },
  signBlock: { width: "42%" },
  signRule: { borderTopWidth: 0.8, borderTopColor: "#333333", paddingTop: 4 },
  signLabel: { fontFamily: "Times-Bold", fontSize: 9.5, letterSpacing: 0.6 },
  signName: { fontSize: 9.5, color: "#444444" },
  witnessHead: { fontFamily: "Times-Bold", fontSize: 10, marginTop: 34, letterSpacing: 1 },
  witnessRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 26 },
  witnessNum: { fontFamily: "Times-Bold", fontSize: 10, marginBottom: 26 },
  hint: { fontSize: 8, color: "#888888" },
  footer: {
    position: "absolute",
    bottom: 26,
    left: 56,
    right: 56,
    fontSize: 7.5,
    color: "#888888",
    textAlign: "center",
    borderTopWidth: 0.5,
    borderTopColor: "#DDDDDD",
    paddingTop: 6,
  },
});

/** Blanks print as a rule of underscores, the way a typed deed leaves them. */
const fill = (value: string | undefined, width = 22) =>
  value && value.trim() ? value.trim() : "_".repeat(width);

function Party({
  party,
  role,
  part,
}: {
  party: AgreementDraft["landlord"];
  role: string;
  part: string;
}) {
  const p = pronoun(party.relation);
  const id = aadhaar(party.aadhaar);
  return (
    <Text style={s.para}>
      {fill(party.fullName, 26)}
      {id ? ` (Aadhaar No: ${id})` : ""}
      {party.parentName ? `, ${RELATION[party.relation]}: ${party.parentName}` : ""}
      {party.age ? `, aged about ${party.age} years` : ""}, residing at{" "}
      {fill(party.address, 40)}, hereinafter called as the <Text style={s.bold}>“{role}”</Text>{" "}
      (which expression shall unless repugnant to the meaning or context thereof include{" "}
      {p.self}, {p.poss} heirs, successors, executors, administrators and assigns) of the{" "}
      {part}.
    </Text>
  );
}

export function AgreementPdf({ draft }: { draft: AgreementDraft }) {
  const clauses = generateClauses(draft);
  const t = draft.terms;
  const title = agreementTitle(draft.type).toUpperCase();
  const executed = t.executionDate ? new Date(t.executionDate) : new Date();
  const at = t.executionPlace.trim() || draft.property.city;
  const isLicence = draft.type === "leave-license";
  const A = isLicence ? "LICENSOR" : "LANDLORD";
  const B = isLicence ? "LICENSEE" : "TENANT";
  const purpose = draft.type === "commercial" ? "COMMERCIAL PURPOSE" : "RESIDENTIAL PURPOSE";

  return (
    <Document
      title={`${title} — ${draft.id}`}
      author={SITE.legalName}
      subject={`${title} prepared for stamping`}
    >
      <Page size="A4" style={s.page}>
        <Text style={s.title}>{title}</Text>

        <Text style={s.para}>
          This {title} is made and executed at {fill(at, 18)} on this {formatDate(executed)}.
        </Text>

        <Text style={s.centreLabel}>BETWEEN</Text>
        <Party party={draft.landlord} role={A} part="ONE PART" />

        <Text style={s.centreLabel}>AND</Text>
        <Party party={draft.tenant} role={B} part="OTHER PART" />

        <Text style={s.para}>
          WHEREAS the {A} is the absolute owner of the premises {fill(propertyAddress(draft), 40)},
          AND WHEREAS the {B} has requested the {A} to rent-out{" "}
          {draft.property.wholeProperty
            ? "the said premises"
            : `${fill(draft.property.portionDescription, 30)} of the above said premises`}{" "}
          more fully described in the schedule hereunder for <Text style={s.bold}>{purpose}</Text>{" "}
          and the {A} has agreed to the same on the following terms and conditions.
        </Text>

        <Text style={s.witnesseth}>NOW THIS DEED OF {title} WITNESSETH:</Text>

        {clauses.map((clause, i) => (
          <View key={clause.id} style={s.clauseRow} wrap={false}>
            <Text style={s.clauseNum}>{i + 1}.</Text>
            <Text style={s.clauseBody}>{rupees(clause.body)}</Text>
          </View>
        ))}

        <Text style={s.scheduleHead}>
          {draft.property.wholeProperty ? "SCHEDULE OF THE PREMISES" : "SCHEDULE OF THE PORTION"}
        </Text>
        <Text style={s.para}>
          All that piece and parcel of {fill(scheduleDescription(draft), 40)}
          {draft.property.builtUpArea
            ? `, admeasuring approximately ${draft.property.builtUpArea} square feet`
            : ""}
          .
        </Text>

        <Text style={s.para}>
          In witness whereof the {A.toLowerCase()} and the {B.toLowerCase()} have signed this deed
          on the day, month and year above written in the presence of witnesses.
        </Text>

        <View style={s.signRow} wrap={false}>
          {[
            [A, draft.landlord.fullName],
            [B, draft.tenant.fullName],
          ].map(([role, name]) => (
            <View key={role} style={s.signBlock}>
              <View style={s.signRule}>
                <Text style={s.signLabel}>{role}</Text>
                <Text style={s.signName}>{name || " "}</Text>
              </View>
            </View>
          ))}
        </View>

        {draft.options.witnessRequired ? (
          <View wrap={false}>
            <Text style={s.witnessHead}>WITNESSES:</Text>
            <View style={s.witnessRow}>
              {["1.", "2."].map((n) => (
                <View key={n} style={s.signBlock}>
                  <Text style={s.witnessNum}>{n}</Text>
                  <View style={s.signRule}>
                    <Text style={s.hint}>Name, address and signature</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        <Text
          style={s.footer}
          render={({ pageNumber, totalPages }) =>
            `${draft.id}  ·  ${SITE.name}  ·  Page ${pageNumber} of ${totalPages}  ·  ` +
            `Draft for stamping — not yet executed`
          }
          fixed
        />
      </Page>
    </Document>
  );
}

export async function renderAgreementPdf(draft: AgreementDraft): Promise<Buffer> {
  return renderToBuffer(<AgreementPdf draft={draft} />);
}
