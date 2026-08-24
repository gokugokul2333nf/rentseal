import { Building2, Home, KeyRound, Star, Store, UserRound } from "lucide-react";
import { STATS } from "@/lib/site";
import { Counter, Reveal } from "@/components/ui/motion";

const SEGMENTS = [
  { icon: Home, label: "Landlords" },
  { icon: UserRound, label: "Tenants" },
  { icon: KeyRound, label: "Real estate agents" },
  { icon: Building2, label: "Property managers" },
  { icon: Store, label: "Small businesses" },
  { icon: Home, label: "Co-living operators" },
  { icon: Building2, label: "Corporate HR teams" },
  { icon: Store, label: "Retail chains" },
];

export function TrustBar() {
  return (
    <section className="relative border-y border-line bg-white">
      <div className="container-page py-11 md:py-14">
        <Reveal>
          <p className="text-center text-[12px] font-bold tracking-[0.16em] text-navy-400 uppercase">
            Built for the people who sign these documents
          </p>
        </Reveal>

        {/*
          This was an infinitely scrolling marquee. It looped forever with no way
          to pause it, which WCAG 2.2.2 asks for on any motion that starts
          automatically and runs beyond five seconds, and it duplicated all eight
          segments into sixteen DOM nodes to fake the seam. A static row says the
          same thing, reads calmer, and can actually be read.
        */}
        <ul className="mt-7 flex flex-wrap justify-center gap-2.5">
          {SEGMENTS.map((seg) => (
            <li
              key={seg.label}
              className="flex items-center gap-2.5 rounded-full border border-line bg-canvas px-4 py-2 text-[13.5px] font-semibold text-navy-600"
            >
              <seg.icon className="size-4 text-brand-600" aria-hidden="true" />
              {seg.label}
            </li>
          ))}
        </ul>

        {/* Stats */}
        <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-line pt-10 lg:grid-cols-4">
          {STATS.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.08} className="text-center">
              <dd className="flex items-baseline justify-center gap-1.5 font-display text-[clamp(2rem,4vw,2.9rem)] font-bold tracking-tight text-navy-950">
                <Counter value={stat.value} />
                {"star" in stat && stat.star ? (
                  <Star className="size-6 fill-amber-400 text-amber-400" />
                ) : null}
              </dd>
              <dt className="mt-2 text-[14.5px] font-semibold text-navy-700">{stat.label}</dt>
              <p className="mt-0.5 text-[12.5px] text-navy-400">{stat.sub}</p>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
