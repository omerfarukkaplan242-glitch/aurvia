import { dictionaries, type Dictionary } from "./dictionaries";
import { isLocale, type Locale } from "./config";

export function getDictionary(locale: string): Dictionary {
  if (!isLocale(locale)) return dictionaries.en;
  return dictionaries[locale];
}

export function htmlLang(locale: Locale): string {
  return locale;
}
