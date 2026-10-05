import Link from "next/link";
import { localePath, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { Currency } from "@/lib/logic/currency";
import { legalDocuments, LEGAL_SLUGS } from "@/lib/content/legal";
import { logout } from "@/lib/actions";
import { CurrencyForm } from "./CurrencyForm";
import { LocaleLinks } from "./LocaleLinks";

const links = [
  ["treatments", "/treatments"],
  ["providers", "/providers"],
  ["destinations", "/destinations"],
  ["experiences", "/experiences"],
  ["trip", "/trip"],
  ["compare", "/compare"],
  ["journey", "/journey"],
] as const;

export function SiteHeader({
  locale,
  d,
  currency,
  signedIn,
  path,
}: {
  locale: Locale;
  d: Dictionary;
  currency: Currency;
  signedIn: boolean;
  path: string;
}) {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-ink/80 backdrop-blur">
      <a href="#content" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-30 focus:bg-cyan focus:px-3 focus:py-2 focus:text-ink">{d.common.skip}</a>
      <div className="flex items-center justify-between gap-4 px-5 py-4 md:px-10">
        <Link href={localePath(locale)} className="text-sm tracking-[0.28em] text-white">{d.brand}</Link>
        <nav aria-label={d.nav.label} className="hidden items-center gap-5 text-sm lg:flex">
          {links.map(([key, href]) => (
            <Link key={key} href={localePath(locale, href)}>{d.nav[key]}</Link>
          ))}
        </nav>
        <div className="flex items-center gap-2 text-sm">
          <CurrencyForm locale={locale} currency={currency} label={d.nav.currency} save={d.common.save} />
          <LocaleLinks locale={locale} path={path} label={d.nav.language} />
          {signedIn ? (
            <form action={logout}>
              <input type="hidden" name="locale" value={locale} />
              <button className="rounded-full border border-line px-3 py-2" type="submit">{d.nav.logout}</button>
            </form>
          ) : (
            <Link className="rounded-full bg-cyan px-3 py-2 font-semibold text-ink" href={localePath(locale, "/login")}>{d.nav.login}</Link>
          )}
        </div>
      </div>
      <nav aria-label={d.nav.label} className="flex gap-4 overflow-x-auto px-5 pb-3 text-sm lg:hidden">
        {links.map(([key, href]) => (
          <Link key={key} className="shrink-0" href={localePath(locale, href)}>{d.nav[key]}</Link>
        ))}
      </nav>
    </header>
  );
}

export function SiteFooter({ locale, d }: { locale: Locale; d: Dictionary }) {
  return (
    <footer className="mt-16 border-t border-white/10 px-5 py-10 md:px-10">
      <p className="serif text-2xl text-white">{d.tagline}</p>
      <p className="mt-3 max-w-2xl text-sm text-faint">{d.disclaimerShort}</p>
      <ul className="mt-6 flex flex-wrap gap-4 text-sm">
        {LEGAL_SLUGS.map((slug) => (
          <li key={slug}><Link href={localePath(locale, `/legal/${slug}`)}>{legalDocuments[slug][locale].title}</Link></li>
        ))}
        <li><Link href={localePath(locale, "/about")}>{d.nav.about}</Link></li>
        <li><Link href={localePath(locale, "/contact")}>{d.nav.contact}</Link></li>
      </ul>
      <p className="mt-6 text-xs text-faint">{d.footer.rights} {d.footer.disclaimer}</p>
    </footer>
  );
}
