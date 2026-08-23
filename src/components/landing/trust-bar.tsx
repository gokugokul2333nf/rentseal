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
      <div className="container-page py-14 md:py-16">
        <Reveal>
          <p className="text-center text-[12px] font-bold tracking-[0.16em] text-navy-400 uppercase">
            Trusted every day by thousands across Tamil Nadu
          </p>
        </Reveal>

        {/* Segments marquee */}
        <div className="marquee-mask mt-8 overflow-hidden">
          <div className="animate-marquee flex w-max gap-3">
            {[...SEGMENTS, ...SEGMENTS].map((seg, i) => (
              <span
                key={`${seg.label}-${i}`}
                className="flex shrink-0 items-center gap-2.5 rounded-full border border-line bg-canvas px-5 py-2.5 text-[14px] font-semibold text-navy-600"
              >
                <seg.icon className="size-4 text-brand-600" />
                {seg.label}
              </span>
            ))}
          </div>
        </div>

        {/* Stats */}
        <dl className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 border-t border-line pt-12 lg:grid-cols-4">
          {STATS.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.08} className="text-center">
              <dd className="flex items-baseline justify-center gap-1.5 font-display text-[clamp(2rem,4vw,2.9rem)] font-extrabold tracking-tight text-navy-950">
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
