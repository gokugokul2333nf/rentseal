import type { MetadataRoute } from "next";
import { SERVICES } from "@/lib/services";
import { CITIES, SITE } from "@/lib/site";

/**
 * Only live routes. The agreement builder, calculator and account pages live
 * under src/app/_disabled and are intentionally absent.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-07-28");

  const staticPages: MetadataRoute.Sitemap = (
    [
      { url: SITE.url, changeFrequency: "weekly", priority: 1 },
      { url: `${SITE.url}/how-it-works`, changeFrequency: "monthly", priority: 0.8 },
      { url: `${SITE.url}/pricing`, changeFrequency: "monthly", priority: 0.9 },
      { url: `${SITE.url}/faq`, changeFrequency: "monthly", priority: 0.7 },
      { url: `${SITE.url}/about`, changeFrequency: "yearly", priority: 0.5 },
      { url: `${SITE.url}/contact`, changeFrequency: "yearly", priority: 0.6 },
      { url: `${SITE.url}/legal/terms`, changeFrequency: "yearly", priority: 0.3 },
      { url: `${SITE.url}/legal/privacy`, changeFrequency: "yearly", priority: 0.3 },
      { url: `${SITE.url}/legal/refund`, changeFrequency: "yearly", priority: 0.3 },
    ] satisfies MetadataRoute.Sitemap
  ).map((page) => ({ ...page, lastModified }));

  const servicePages: MetadataRoute.Sitemap = SERVICES.map((service) => ({
    url: `${SITE.url}/services/${service.slug}`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.9,
  }));

  const cityPages: MetadataRoute.Sitemap = CITIES.map((city) => ({
    url: `${SITE.url}/rental-agreement/${city.slug}`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticPages, ...servicePages, ...cityPages];
}
