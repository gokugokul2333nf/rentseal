"use client";

import { AnimatePresence, motion } from "framer-motion";
import { agreementTitle, generateClauses, propertyAddress } from "@/lib/clauses";
import type { AgreementDraft } from "@/lib/types";
import { addMonths, cn, formatDate, inr, maskAadhaar, rupeesInWords } from "@/lib/utils";

function Blank({ children, w = "auto" }: { children?: React.ReactNode; w?: string }) {
  if (children) return <span className="font-semibold text-navy-950">{children}</span>;
  return (
    <span
      className="inline-block translate-y-0.5 rounded border-b border-dashed border-navy-300 bg-amber-50/70 align-baseline"
      style={{ width: w, height: "1em" }}
      aria-label="not filled in yet"
    />
  );
}

/**
 * The instrument itself. Rendered live in the builder, in Review, and on the
 * print sheet — one source of truth so what you see is what gets stamped.
 */
export function AgreementDocument({
  draft,
  animate = true,
  className,
}: {
  draft: AgreementDraft;
  animate?: boolean;
  className?: string;
}) {
  const clauses = generateClauses(draft);
  const t = draft.terms;
  const start = t.startDate ? new Date(t.startDate) : new Date();
  const end = addMonths(start, t.durationMonths || 11);
  const rent = parseFloat(t.monthlyRent || "0");
  const deposit = parseFloat(t.securityDeposit || "0");
  const isLicence = draft.type === "leave-license";
  const partyA = isLicence ? "LICENSOR" : "LANDLORD";
  const partyB = isLicence ? "LICENSEE" : "TENANT";

  const Wrapper = animate ? motion.div : "div";

  return (
    <article
      className={cn(
        "print-sheet bg-white font-sans text-[13px] leading-[1.85] text-navy-800",
        className,
      )}
    >
      {/* e-Stamp header */}
      <header className="avoid-break mb-7 border-b-2 border-navy-950 pb-5 text-center">
        <p className="text-[9px] font-bold tracking-[0.24em] text-navy-500 uppercase">
          Government of Tamil Nadu · Registration Department
        </p>
        <p className="mt-1 text-[9px] font-semibold tracking-[0.14em] text-navy-400 uppercase">
          e-Stamp Certificate · Article 35, Indian Stamp Act 1899
        </p>
        <h1 className="mt-4 font-display text-[19px] font-extrabold tracking-tight text-navy-950 uppercase">
          {agreementTitle(draft.type)}
        </h1>
        <p className="mt-2 text-[11px] text-navy-500">
          Certificate No. {draft.id} · Executed at{" "}
          <Blank w="80px">{draft.property.city || undefined}</Blank> on {formatDate(start)}
        </p>
      </header>

      {/* Parties */}
      <section className="avoid-break mb-6">
        <p className="mb-3">
          This {agreementTitle(draft.type)} is made on this {formatDate(start)} at{" "}
          <Blank w="90px">{draft.property.city || undefined}</Blank>, Tamil Nadu,
        </p>

        <div className="mb-3 pl-4">
          <p className="mb-1 text-[10px] font-bold tracking-[0.12em] text-navy-400 uppercase">
            Between
          </p>
          <p>
            <Blank w="150px">{draft.landlord.fullName || undefined}</Blank>
            {draft.landlord.parentName ? (
              <>
                , son/daughter of <Blank>{draft.landlord.parentName}</Blank>
              </>
            ) : null}
            {draft.landlord.age ? <>, aged about <Blank>{draft.landlord.age}</Blank> years</> : null}
            , residing at <Blank w="220px">{draft.landlord.address || undefined}</Blank>
            {draft.landlord.pan ? (
              <>
                , holding PAN <Blank>{draft.landlord.pan.toUpperCase()}</Blank>
              </>
            ) : null}
            {draft.landlord.aadhaar ? (
              <>
                {" "}
                and Aadhaar <Blank>{maskAadhaar(draft.landlord.aadhaar)}</Blank>
              </>
            ) : null}
            , hereinafter referred to as the{" "}
            <strong className="font-bold text-navy-950">&ldquo;{partyA}&rdquo;</strong> (which
            expression shall include their heirs, executors, administrators and assigns) of the
            ONE PART;
          </p>
        </div>

        <div className="pl-4">
          <p className="mb-1 text-[10px] font-bold tracking-[0.12em] text-navy-400 uppercase">
            And
          </p>
          <p>
            <Blank w="150px">{draft.tenant.fullName || undefined}</Blank>
            {draft.tenant.parentName ? (
              <>
                , son/daughter of <Blank>{draft.tenant.parentName}</Blank>
              </>
            ) : null}
            {draft.tenant.age ? <>, aged about <Blank>{draft.tenant.age}</Blank> years</> : null}
            , residing at <Blank w="220px">{draft.tenant.address || undefined}</Blank>
            {draft.tenant.pan ? (
              <>
                , holding PAN <Blank>{draft.tenant.pan.toUpperCase()}</Blank>
              </>
            ) : null}
            {draft.tenant.aadhaar ? (
              <>
                {" "}
                and Aadhaar <Blank>{maskAadhaar(draft.tenant.aadhaar)}</Blank>
              </>
            ) : null}
            , hereinafter referred to as the{" "}
            <strong className="font-bold text-navy-950">&ldquo;{partyB}&rdquo;</strong> (which
            expression shall include their heirs, executors, administrators and permitted
            assigns) of the OTHER PART.
          </p>
        </div>
      </section>

      {/* Recitals */}
      <section className="avoid-break mb-6">
        <p className="mb-2 text-[10px] font-bold tracking-[0.12em] text-navy-400 uppercase">
          Whereas
        </p>
        <p className="pl-4">
          The {partyA} is the absolute owner of and is lawfully seized and possessed of the
          premises more particularly described in the Schedule below, and the {partyB} having
          approached the {partyA} for occupation of the said premises, the {partyA} has agreed
          to grant the same on the terms and conditions recorded in this deed.
        </p>
      </section>

      {/* Key terms table */}
      <section className="avoid-break mb-7">
        <p className="mb-2 text-[10px] font-bold tracking-[0.12em] text-navy-400 uppercase">
          Key terms at a glance
        </p>
        <table className="w-full border-collapse text-[12px]">
          <tbody>
            {[
              ["Monthly rent", rent > 0 ? `${inr(rent)} (${rupeesInWords(rent)})` : null],
              ["Security deposit", deposit > 0 ? `${inr(deposit)} (${rupeesInWords(deposit)})` : null],
              ["Term", `${t.durationMonths} months`],
              ["Commencing", formatDate(start)],
              ["Expiring", formatDate(end)],
              ["Rent due on", `${t.rentDueDay} of every month`],
              ["Notice period", `${t.noticePeriodMonths} month(s)`],
              t.lockInMonths && parseFloat(t.lockInMonths) > 0
                ? ["Lock-in period", `${t.lockInMonths} months`]
                : null,
            ]
              .filter(Boolean)
              .map((row) => {
                const [label, value] = row as [string, string | null];
                return (
                  <tr key={label} className="border-b border-navy-100 last:border-0">
                    <th className="w-[38%] py-2 pr-4 text-left align-top font-semibold text-navy-600">
                      {label}
                    </th>
                    <td className="py-2 align-top">
                      <Blank w="140px">{value ?? undefined}</Blank>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </section>

      {/* Operative clauses */}
      <section className="mb-7">
        <p className="mb-4 text-[10px] font-bold tracking-[0.12em] text-navy-400 uppercase">
          Now this deed witnesseth as follows
        </p>

        <ol className="space-y-4">
          <AnimatePresence initial={false} mode="popLayout">
            {clauses.map((clause, i) => (
              <Wrapper
                key={clause.id}
                {...(animate
                  ? {
                      layout: true,
                      initial: { opacity: 0, height: 0 },
                      animate: { opacity: 1, height: "auto" },
                      exit: { opacity: 0, height: 0 },
                      transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
                    }
                  : {})}
                className="overflow-hidden"
              >
                <li className="avoid-break list-none">
                  <h2 className="mb-1 flex items-baseline gap-2 font-display text-[13px] font-bold text-navy-950">
                    <span className="tnum">{i + 1}.</span>
                    <span>{clause.title}</span>
                    {clause.trigger ? (
                      <span className="no-print rounded-full bg-brand-100 px-2 py-0.5 text-[8.5px] font-bold tracking-wide text-brand-700 uppercase">
                        {clause.trigger}
                      </span>
                    ) : null}
                  </h2>
                  <p className="pl-5 text-justify">{clause.body}</p>
                </li>
              </Wrapper>
            ))}
          </AnimatePresence>
        </ol>
      </section>

      {/* Schedule A */}
      <section className="avoid-break mb-7 border-t border-navy-200 pt-5">
        <h2 className="mb-3 text-center font-display text-[13px] font-bold tracking-wide text-navy-950 uppercase">
          Schedule A — Description of the Premises
        </h2>
        <p className="text-justify">
          All that {draft.property.kind.replace("-", " ")} bearing{" "}
          <Blank w="200px">{propertyAddress(draft) || undefined}</Blank>
          {draft.property.builtUpArea ? (
            <>
              , admeasuring approximately <Blank>{draft.property.builtUpArea}</Blank> square feet
              of built-up area
            </>
          ) : null}
          {draft.property.bedrooms && draft.type !== "commercial" ? (
            <>
              , comprising <Blank>{draft.property.bedrooms}</Blank> bedroom(s) and{" "}
              <Blank>{draft.property.bathrooms}</Blank> bathroom(s)
            </>
          ) : null}
          {draft.property.floor ? (
            <>
              , situated on the <Blank>{draft.property.floor}</Blank> floor
            </>
          ) : null}
          , together with the fittings, fixtures and amenities existing therein.
          {draft.property.amenities.length ? (
            <>
              {" "}
              The following amenities are available to the {partyB}:{" "}
              <strong className="font-semibold text-navy-950">
                {draft.property.amenities.join(", ")}
              </strong>
              .
            </>
          ) : null}
        </p>
      </section>

      {/* Schedule B — inventory */}
      {draft.property.furnishing !== "unfurnished" && draft.furniture.some((f) => f.name.trim()) ? (
        <section className="avoid-break mb-7">
          <h2 className="mb-3 text-center font-display text-[13px] font-bold tracking-wide text-navy-950 uppercase">
            Schedule B — Inventory of Fixtures and Fittings
          </h2>
          <table className="w-full border-collapse text-[12px]">
            <thead>
              <tr className="border-y border-navy-200 bg-navy-50">
                <th className="w-10 py-2 pl-2 text-left font-semibold">#</th>
                <th className="py-2 text-left font-semibold">Article</th>
                <th className="w-20 py-2 text-center font-semibold">Quantity</th>
                <th className="w-28 py-2 text-left font-semibold">Condition</th>
              </tr>
            </thead>
            <tbody>
              {draft.furniture
                .filter((f) => f.name.trim())
                .map((item, i) => (
                  <tr key={item.id} className="border-b border-navy-100">
                    <td className="tnum py-2 pl-2">{i + 1}</td>
                    <td className="py-2 font-medium text-navy-900">{item.name}</td>
                    <td className="tnum py-2 text-center">{item.quantity}</td>
                    <td className="py-2 capitalize">{item.condition}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </section>
      ) : null}

      {/* Execution */}
      <section className="avoid-break border-t border-navy-200 pt-6">
        <p className="mb-8 text-justify">
          IN WITNESS WHEREOF the parties have set their hands to this deed on the day, month and
          year first above written, in the presence of the witnesses named below.
        </p>

        <div className="grid grid-cols-2 gap-10">
          {[
            { role: partyA, name: draft.landlord.fullName },
            { role: partyB, name: draft.tenant.fullName },
          ].map((party) => (
            <div key={party.role}>
              <div className="h-14 border-b border-navy-400" />
              <p className="mt-2 text-[11px] font-bold text-navy-950">{party.role}</p>
              <p className="text-[11px] text-navy-500">
                <Blank w="120px">{party.name || undefined}</Blank>
              </p>
            </div>
          ))}
        </div>

        {draft.options.witnessRequired ? (
          <div className="mt-10 grid grid-cols-2 gap-10">
            {["Witness 1", "Witness 2"].map((w) => (
              <div key={w}>
                <div className="h-14 border-b border-navy-400" />
                <p className="mt-2 text-[11px] font-bold text-navy-950">{w}</p>
                <p className="text-[11px] text-navy-400">Name, address and signature</p>
              </div>
            ))}
          </div>
        ) : null}

        <p className="mt-10 border-t border-dashed border-navy-200 pt-4 text-center text-[9.5px] leading-relaxed text-navy-400">
          Generated by RentSeal · Document {draft.id} · This instrument is executed
          electronically and signed using Aadhaar e-Sign under Section 3A of the Information
          Technology Act, 2000. Stamp duty paid to the Government of Tamil Nadu is evidenced by
          the e-Stamp certificate affixed to page 1.
        </p>
      </section>
    </article>
  );
}
