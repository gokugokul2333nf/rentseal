import Link from "next/link";
import {
  ArrowRight,
  BedDouble,
  Briefcase,
  Building,
  Building2,
  CircleParking,
  DoorOpen,
  Factory,
  FileSignature,
  Home,
  House,
  KeyRound,
  Landmark,
  LayoutGrid,
  Map,
  PanelsTopLeft,
  RefreshCw,
  ShoppingBag,
  Sofa,
  Sprout,
  Stethoscope,
  Store,
  TreePalm,
  Users,
  UtensilsCrossed,
  Warehouse,
} from "lucide-react";
import { getTemplatesByCategory, SERVICE_SLUG_BY_TYPE, TEMPLATES } from "@/lib/templates";
import type { AgreementTemplate } from "@/lib/templates";
import { Badge } from "@/components/ui/card";
import { Stagger, StaggerItem } from "@/components/ui/motion";
import { SectionHeading } from "@/components/ui/section-heading";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Home,
  Building,
  House,
  TreePalm,
  DoorOpen,
  Sofa,
  RefreshCw,
  Store,
  Briefcase,
  PanelsTopLeft,
  Warehouse,
  UtensilsCrossed,
  Stethoscope,
  Factory,
  ShoppingBag,
  Landmark,
  FileSignature,
  Building2,
  Map,
  Sprout,
  KeyRound,
  BedDouble,
  Users,
  CircleParking,
};

const CATEGORY_TONE: Record<
  AgreementTemplate["category"],
  "brand" | "emerald" | "violet" | "amber"
> = {
  Residential: "brand",
  Commercial: "emerald",
  "Lease deed": "violet",
  "Leave & licence": "amber",
};

function TemplateCard({ template }: { template: AgreementTemplate }) {
  const Icon = ICONS[template.icon] ?? Home;
  return (
    <Link
      href={`/services/${SERVICE_SLUG_BY_TYPE[template.baseType]}`}
      className="group relative flex h-full flex-col rounded-2xl border border-line bg-white p-5 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-brand-300 hover:shadow-lift"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-navy-950 text-white transition-colors duration-300 group-hover:bg-brand-600">
          <Icon className="size-4.5" />
        </span>
        {template.popular ? <Badge tone="dark">Popular</Badge> : null}
      </div>

      <h3 className="mt-4 font-display text-[15.5px] leading-snug font-bold text-navy-950">
        {template.name}
      </h3>
      <p className="mt-1.5 flex-1 text-[13px] leading-[1.65] text-navy-500">
        {template.description}
      </p>

      <div className="mt-4 flex items-center justify-between gap-2">
        <span className="rounded-full border border-line bg-canvas px-2.5 py-1 text-[11.5px] font-medium text-navy-600">
          {template.term}
        </span>
        <span className="inline-flex items-center gap-1 text-[12.5px] font-semibold text-brand-700">
          Draft this
          <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}

/**
 * Moved off the homepage, where it was the single largest section — 25 cards
 * and roughly 3,700px of scroll leading to only four unique destinations.
 * `heading={false}` hides the section heading when the page already has one.
 */
export function TemplateLibrary({ heading = true }: { heading?: boolean } = {}) {
  const groups = getTemplatesByCategory();

  return (
    <section id="templates" className="section">
      <div className="container-page">
        {heading ? (
          <SectionHeading
            eyebrow="Template library"
            icon={LayoutGrid}
            title={`${TEMPLATES.length} agreement templates, ready to draft`}
            body="Every template below is a Tamil Nadu compliant draft built on one of our four instruments — pick the one that matches your situation and the right clauses come with it."
          />
        ) : null}

        <div className="space-y-14">
          {groups.map(({ category, templates }) => (
            <div key={category}>
              <div className="flex items-center gap-3">
                <Badge tone={CATEGORY_TONE[category]}>{category}</Badge>
                <span className="text-[13px] font-medium text-navy-500">
                  {templates.length} template{templates.length === 1 ? "" : "s"}
                </span>
                <span aria-hidden="true" className="h-px flex-1 bg-line" />
              </div>

              <Stagger className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" amount={0.05}>
                {templates.map((template) => (
                  <StaggerItem key={template.id} className="h-full">
                    <TemplateCard template={template} />
                  </StaggerItem>
                ))}
              </Stagger>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
