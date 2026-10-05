import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const site = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/auth/",
        ...["en", "de", "tr"].flatMap((locale) => [
          `/${locale}/admin`,
          `/${locale}/documents`,
          `/${locale}/messages`,
          `/${locale}/notifications`,
          `/${locale}/onboarding`,
          `/${locale}/provider`,
          `/${locale}/journey`,
          `/${locale}/reset`,
        ]),
      ],
    },
    sitemap: `${site}/sitemap.xml`,
  };
}
