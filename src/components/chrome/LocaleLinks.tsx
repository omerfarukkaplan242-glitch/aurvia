"use client";

import Link from "next/link";
import { LOCALES, type Locale } from "@/lib/i18n/config";

export function LocaleLinks({ locale, path, label }: { locale: Locale; path: string; label: string }) {
  return (
    <nav aria-label={label} className="flex gap-1">
      {LOCALES.map((item) => {
        const nextPath = path.replace(/^\/(en|de|tr)/, `/${item}`) || `/${item}`;
        return (
          <Link
            key={item}
            href={nextPath}
            hrefLang={item}
            aria-current={item === locale ? "page" : undefined}
            className={item === locale ? "text-cyan" : "text-faint"}
            onClick={(event) => {
              if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
              event.preventDefault();
              window.location.assign(nextPath + window.location.search);
            }}
          >
            {item.toUpperCase()}
          </Link>
        );
      })}
    </nav>
  );
}
