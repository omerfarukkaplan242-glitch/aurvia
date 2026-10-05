import type { MetadataRoute } from "next";
import { LOCALES } from "@/lib/i18n/config";
import { destinations, experiences, providers, treatments } from "@/lib/demo/inventory";
import { LEGAL_SLUGS } from "@/lib/content/legal";

export default function sitemap(): MetadataRoute.Sitemap {
  const site = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const paths = [
    "",
    "/treatments",
    "/providers",
    "/destinations",
    "/experiences",
    "/trip",
    "/compare",
    "/match",
    "/about",
    "/contact",
    "/login",
    "/signup",
    ...treatments.map((item) => `/treatments/${item.slug}`),
    ...providers.map((item) => `/providers/${item.slug}`),
    ...destinations.map((item) => `/destinations/${item.slug}`),
    ...experiences.map((item) => `/experiences/${item.id}`),
    ...LEGAL_SLUGS.map((slug) => `/legal/${slug}`),
  ];
  return LOCALES.flatMap((locale) =>
    paths.map((path) => ({
      url: `${site}/${locale}${path}`,
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.6,
    })),
  );
}
