import { Scale } from "lucide-react";
import { BreadcrumbSchema, PageHero } from "@/components/site/page-hero";
import { Reveal } from "@/components/ui/motion";
import { SITE } from "@/lib/site";

export interface LegalSection {
  id: string;
  heading: string;
  paragraphs: string[];
  list?: string[];
}

export function LegalPage({
  title,
  intro,
  updated,
  sections,
  crumbLabel,
}: {
  title: string;
  intro: string;
  updated: string;
  sections: LegalSection[];
  crumbLabel: string;
}) {
  const crumbs = [
    { label: "Home", href: "/" },
    { label: "Legal", href: "/legal/terms" },
    { label: crumbLabel },
  ];

  return (
    <>
      <PageHero
        eyebrow={`Last updated ${updated}`}
        icon={Scale}
        crumbs={crumbs}
        title={title}
        body={intro}
        compact
      />

      <section className="section">
        <div className="container-page">
          <div className="grid gap-10 lg:grid-cols-[240px_1fr] lg:gap-16">
            {/* Contents */}
            <aside className="lg:sticky lg:top-28 lg:self-start">
              <p className="mb-3 text-[11.5px] font-bold tracking-[0.14em] text-navy-400 uppercase">
                On this page
              </p>
              <nav>
                <ul className="space-y-1.5">
                  {sections.map((s, i) => (
                    <li key={s.id}>
                      <a
                        href={`#${s.id}`}
                        className="flex gap-2.5 rounded-lg px-2.5 py-1.5 text-[13.5px] text-navy-500 transition-colors hover:bg-navy-100 hover:text-navy-950"
                      >
                        <span className="tnum shrink-0 text-navy-300">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        {s.heading}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </aside>

            {/* Body */}
            <div className="min-w-0 max-w-3xl">
              {sections.map((section, i) => (
                <Reveal key={section.id} delay={0.02 * i}>
                  <section id={section.id} className="scroll-mt-28 border-b border-line py-8 first:pt-0 last:border-0">
                    <h2 className="font-display text-[20px] font-bold tracking-tight text-navy-950">
                      <span className="tnum mr-2.5 text-[15px] font-bold text-navy-300">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {section.heading}
                    </h2>
                    <div className="mt-4 space-y-4">
                      {section.paragraphs.map((p, j) => (
                        <p key={j} className="text-[15px] leading-[1.8] text-navy-600">
                          {p}
                        </p>
                      ))}
                      {section.list ? (
                        <ul className="mt-4 space-y-2.5">
                          {section.list.map((item) => (
                            <li
                              key={item}
                              className="flex gap-3 text-[14.5px] leading-[1.75] text-navy-600"
                            >
                              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-brand-500" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  </section>
                </Reveal>
              ))}

              <Reveal>
                <div className="mt-10 rounded-2xl border border-line bg-canvas p-6">
                  <p className="text-[14px] leading-relaxed text-navy-600">
                    Questions about this document? Write to{" "}
                    <a
                      href={`mailto:${SITE.email}`}
                      className="font-semibold text-brand-700 underline underline-offset-4"
                    >
                      {SITE.email}
                    </a>{" "}
                    or call {SITE.phone}. {SITE.legalName}, {SITE.address}.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <BreadcrumbSchema crumbs={crumbs} baseUrl={SITE.url} />
    </>
  );
}
