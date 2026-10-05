import type { Metadata } from "next";
import type { Locale } from "./i18n/config";
import { LOCALES } from "./i18n/config";

export function pageMetadata(locale: Locale, title: string, path: string, description: string): Metadata {
  const site = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const canonical = `${site}/${locale}${path}`;
  const languages = Object.fromEntries(LOCALES.map((item) => [item, `${site}/${item}${path}`]));
  return {
    title,
    description,
    alternates: { canonical, languages },
    openGraph: { title, description, url: canonical, siteName: "AURVIA", type: "website", locale },
    twitter: { card: "summary_large_image", title, description },
  };
}
