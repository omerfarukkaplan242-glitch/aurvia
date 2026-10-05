export const LOCALES = ["en", "de", "tr"] as const;
export type Locale = (typeof LOCALES)[number];

/** Prepared in the schema and routing helpers, not yet public routes. */
export const PREPARED_LOCALES = ["fr", "ar", "nl", "ru"] as const;

export const DEFAULT_LOCALE: Locale = "en";

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

export function localePath(locale: Locale, path = ""): string {
  const suffix = path.startsWith("/") ? path : path ? `/${path}` : "";
  return `/${locale}${suffix}`;
}
