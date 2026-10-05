import type { Metadata } from "next";
import type { Locale } from "./i18n/config";
import { LOCALES } from "./i18n/config";

const PRIVATE_PREFIXES = ["/journey", "/documents", "/messages", "/notifications", "/onboarding", "/provider", "/admin", "/reset"];

export function pageMetadata(locale: Locale, title: string, path: string, description: string, absolute = false): Metadata {
  const site = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const canonical = `${site}/${locale}${path}`;
  const languages = Object.fromEntries(LOCALES.map((item) => [item, `${site}/${item}${path}`]));
  const isPrivate = PRIVATE_PREFIXES.some((item) => path === item || path.startsWith(`${item}/`));
  return {
    title: absolute ? { absolute: title } : title,
    description,
    robots: isPrivate ? { index: false, follow: false } : { index: true, follow: true },
    alternates: { canonical, languages: { ...languages, "x-default": `${site}/en${path}` } },
    openGraph: { title, description, url: canonical, siteName: "AURVIA", type: "website", locale },
    twitter: { card: "summary_large_image", title, description },
  };
}
