import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  Building2,
  Check,
  Clock3,
  Landmark,
  MapPin,
  ShieldCheck,
  Stamp,
} from "lucide-react";
import { BreadcrumbSchema, PageHero } from "@/components/site/page-hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { PricingCards } from "@/components/landing/pricing-cards";
import { FaqSection } from "@/components/landing/faq-section";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Counter, Reveal, Stagger, StaggerItem } from "@/components/ui/motion";
import { SectionHeading } from "@/components/ui/section-heading";
import { DISTRICTS, ZONE_META, getDistrict, nearbyDistricts } from "@/lib/districts";
import { AGREEMENT_TYPES, LEAD_ANCHOR, SITE } from "@/lib/site";

export function generateStaticParams() {
  return DISTRICTS.map((d) => ({ district: d.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ district: string }>;
}): Promise<Metadata> {
  const { district: slug } = await params;
  const district = getDistrict(slug);
  if (!district) return {};

  const title = `Rental Agreement in ${district.name} — Online, e-Stamped`;
  const description = `Create a legally valid rental agreement anywhere in ${district.name} district. E-stamped at the government rate, Aadhaar e-signed and delivered by email and WhatsApp. ${district.orders} orders delivered across ${district.name}.`;

  return {
    title,
    description,
    alternates: { canonical: `/rental-agreement/${district.slug}` },
    openGraph: { title, description },
    keywords: [
      `rental agreement ${district.name}`,
      `rental agreement in ${district.hq}`,
      `online rental agreement ${district.name}`,
      `lease agreement ${district.name}`,
      ...district.towns.map((t) => `rental agreement ${t}`),
    ],
  };
}

export default async function DistrictPage({
  params,
}: {
  params: Promise<{ district: string }>;
}) {
  const { district: slug } = await params;
  const district = getDistrict(slug);
  if (!district) notFound();

  const zone = ZONE_META[district.zone];
  const nearby = nearbyDistricts(district);

  const crumbs = [
    { label: "Home", href: "/" },
    { label: "Rental agreement", href: "/rental-agreement" },
    { label: district.name },
  ];

  return (
    <>
      <PageHero
        eyebrow={`${district.name} District · ${district.region}`}
        icon={MapPin}
        crumbs={crumbs}
        title={`Rental agreement in ${district.name}, done from your phone`}
        body={`${district.orders} landlords and tenants across ${district.name} district have made their agreement with us. E-stamped at the government rate, signed with Aadhaar OTP, and delivered without anyone visiting the Sub-Registrar Office.`}
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <ButtonLink href={LEAD_ANCHOR} size="lg" className="group">
            Get my {district.name} agreement started
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </ButtonLink>
          <ButtonLink
            href={`https://wa.me/${SITE.whatsapp.replace(/\D/g, "")}`}
            variant="secondary"
            size="lg"
          >
            Ask on WhatsApp
          </ButtonLink>
        </div>
      </PageHero>

      {/* Local facts */}
      <section className="section">
        <div className="container-page">
          <Stagger className="grid gap-4 md:grid-cols-2 lg:grid-cols-4" amount={0.1}>
            {[
              {
                icon: Stamp,
                label: "Stamp duty rate",
                value: "1%",
                sub: "of total rent plus deposit, same across Tamil Nadu",
              },
              {
                icon: Clock3,
                label: "Delivery to " + district.name,
                value: zone.eta,
                sub: zone.cutOff ?? `${zone.label} zone, ₹${zone.charge} or free above ₹2,000`,
              },
              {
                icon: Landmark,
                label: "Registration needed",
                value: "12 months+",
                sub: "an 11-month agreement needs only e-stamping",
              },
              {
                icon: ShieldCheck,
                label: "Orders delivered",
                value: district.orders,
                sub: `across ${district.name} since 2021`,
              },
            ].map((stat) => (
              <StaggerItem key={stat.label}>
                <Card className="h-full p-6">
                  <stat.icon className="size-5 text-brand-600" />
                  <p className="mt-4 text-[12px] font-bold tracking-[0.12em] text-navy-400 uppercase">
                    {stat.label}
                  </p>
                  <p className="mt-1.5 font-display text-[26px] font-extrabold tracking-tight text-navy-950">
                    <Counter value={stat.value} />
                  </p>
                  <p className="mt-1 text-[12.5px] leading-snug text-navy-500">{stat.sub}</p>
                </Card>
              </StaggerItem>
            ))}
          </Stagger>

          {/* What the district actually rents */}
          <Reveal delay={0.1}>
            <div className="mt-12 rounded-2xl border border-line bg-white p-7 sm:p-9">
              <h2 className="font-display text-[20px] font-bold text-navy-950">
                What renting looks like in {district.name}
              </h2>
              <p className="mt-4 text-[15px] leading-[1.75] text-navy-600">{district.economy}</p>
              <p className="mt-3 text-[15px] leading-[1.75] text-navy-600">{district.demand}</p>
            </div>
          </Reveal>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <Reveal>
              <div className="h-full rounded-2xl border border-line bg-white p-7">
                <h2 className="flex items-center gap-2.5 font-display text-[18px] font-bold text-navy-950">
                  <Landmark className="size-5 text-brand-600" />
                  Sub-Registrar Offices in {district.name}
                </h2>
                <p className="mt-3 text-[14.5px] leading-[1.7] text-navy-600">
                  The Registration Department runs an office at each taluk headquarters below. If
                  your term runs 12 months or longer, registration is compulsory and both parties
                  must appear in person — we prepare the deed, compute the fee and book your slot
                  at the office with jurisdiction.
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {district.sroTowns.map((office) => (
                    <span
                      key={office}
                      className="rounded-full border border-line bg-canvas px-3.5 py-2 text-[13px] font-medium text-navy-600"
                    >
                      {office}
                    </span>
                  ))}
                </div>
                <p className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-[13px] leading-relaxed text-emerald-900">
                  Renting for 11 months? You skip all of this. E-stamping alone makes the
                  agreement valid in evidence, and it happens entirely online.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="h-full rounded-2xl border border-line bg-white p-7">
                <h2 className="flex items-center gap-2.5 font-display text-[18px] font-bold text-navy-950">
                  <Building2 className="size-5 text-brand-600" />
                  Where our {district.name} orders come from
                </h2>
                <p className="mt-3 text-[14.5px] leading-[1.7] text-navy-600">
                  Most of our work in this district comes from these towns and localities — though
                  we cover every taluk in {district.name} and all 38 districts of Tamil Nadu.
                </p>
                <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                  {district.towns.map((area) => (
                    <li key={area} className="flex items-center gap-2.5 text-[14px] text-navy-700">
                      <Check className="size-4 shrink-0 text-emerald-500" strokeWidth={3} />
                      {area}
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/stamp-paper/${district.slug}`}
                  className="mt-6 inline-flex items-center gap-1.5 text-[14px] font-semibold text-brand-700 underline underline-offset-4"
                >
                  Buy stamp paper in {district.name}
                  <ArrowRight className="size-3.5" />
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Types available here */}
      <section className="section border-y border-line bg-white">
        <div className="container-page">
          <SectionHeading
            eyebrow={`Available across ${district.name}`}
            title="Four agreement types, all e-stamped for Tamil Nadu"
            body={`Whether you are letting a flat in ${district.towns[0]} or a godown on the outskirts, the right instrument is here.`}
          />

          <Stagger className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" amount={0.1}>
            {AGREEMENT_TYPES.map((type) => (
              <StaggerItem key={type.id}>
                <Link
                  href={`/services/${type.slug}`}
                  className="group flex h-full flex-col rounded-2xl border border-line bg-canvas/60 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand-300 hover:bg-white hover:shadow-card"
                >
                  <h3 className="font-display text-[16px] font-bold text-navy-950">{type.short}</h3>
                  <p className="mt-2 flex-1 text-[13.5px] leading-relaxed text-navy-500">
                    {type.description}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-brand-700">
                    Read more
                    <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <HowItWorks />
      <PricingCards />
      <FaqSection limit={8} />

      {/* Nearby districts */}
      <section className="section border-t border-line bg-white">
        <div className="container-page">
          <SectionHeading title={`Rental agreements elsewhere in ${district.region}`} align="left" />
          <div className="mt-8 flex flex-wrap gap-2.5">
            {nearby.map((other) => (
              <Link
                key={other.slug}
                href={`/rental-agreement/${other.slug}`}
                className="rounded-full border border-line bg-canvas px-4 py-2.5 text-[14px] font-medium text-navy-600 transition-all hover:border-brand-300 hover:bg-white hover:text-brand-700"
              >
                Rental agreement in {other.name}
              </Link>
            ))}
          </div>
          <Link
            href="/rental-agreement"
            className="mt-7 inline-flex items-center gap-1.5 text-[14.5px] font-semibold text-brand-700 underline underline-offset-4"
          >
            See all 38 districts
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      <BreadcrumbSchema crumbs={crumbs} baseUrl={SITE.url} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: `${SITE.name} — ${district.name}`,
            description: `Online rental agreement drafting, e-stamping and e-signing across ${district.name} district, Tamil Nadu.`,
            url: `${SITE.url}/rental-agreement/${district.slug}`,
            telephone: SITE.phone,
            priceRange: "₹349 – ₹1499",
            areaServed: {
              "@type": "AdministrativeArea",
              name: `${district.name} district`,
              containedInPlace: { "@type": "State", name: "Tamil Nadu" },
            },
            address: {
              "@type": "PostalAddress",
              addressLocality: district.hq,
              addressRegion: "Tamil Nadu",
              addressCountry: "IN",
            },
            parentOrganization: { "@id": `${SITE.url}/#organization` },
          }),
        }}
      />
    </>
  );
}
