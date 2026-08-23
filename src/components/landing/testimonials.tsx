import { BadgeCheck, MapPin, Quote, Star } from "lucide-react";
import { TESTIMONIALS } from "@/lib/site";
import { Stagger, StaggerItem } from "@/components/ui/motion";
import { SectionHeading } from "@/components/ui/section-heading";
import { avatarTint, cn, initials } from "@/lib/utils";

export function Testimonials() {
  return (
    <section id="testimonials" className="section relative overflow-hidden bg-canvas">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-dots opacity-40" />

      <div className="container-page">
        <SectionHeading
          eyebrow="Customer stories"
          icon={Quote}
          title="6,400 reviews, and the same sentence keeps coming up"
          body="&ldquo;I didn't have to go anywhere.&rdquo; Here is what landlords, tenants and brokers across Tamil Nadu actually said."
        />

        <Stagger className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3" amount={0.05}>
          {TESTIMONIALS.map((t) => (
            <StaggerItem key={t.name}>
              <figure className="flex h-full flex-col rounded-2xl border border-line bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card">
                <div className="flex items-center gap-1">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="size-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <blockquote className="mt-4 flex-1 text-[14.5px] leading-[1.75] text-navy-700">
                  &ldquo;{t.body}&rdquo;
                </blockquote>

                <figcaption className="mt-6 flex items-center gap-3 border-t border-line pt-5">
                  <span
                    className={cn(
                      "grid size-11 shrink-0 place-items-center rounded-full text-[14px] font-bold",
                      avatarTint(t.name),
                    )}
                  >
                    {initials(t.name)}
                  </span>
                  <div className="min-w-0">
                    <p className="flex items-center gap-1.5 text-[14px] font-bold text-navy-950">
                      {t.name}
                      <BadgeCheck className="size-4 shrink-0 text-brand-600" />
                    </p>
                    <p className="text-[12.5px] text-navy-500">{t.role}</p>
                    <p className="mt-0.5 flex items-center gap-1 text-[12px] text-navy-400">
                      <MapPin className="size-3" />
                      {t.city}
                    </p>
                  </div>
                </figcaption>
              </figure>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
