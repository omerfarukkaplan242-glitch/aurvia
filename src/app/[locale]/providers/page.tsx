import Link from "next/link";
import { notFound } from "next/navigation";
import { cityLabel, destinations, packages, providers, treatments } from "@/lib/demo/inventory";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { isLocale, localePath, type Locale } from "@/lib/i18n/config";
import { convertFromEur, formatMoney, isCurrency } from "@/lib/logic/currency";
import { cookies } from "next/headers";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const d = getDictionary(locale);
  return pageMetadata(locale, d.nav.providers, "/providers", d.home.providersBody);
}

export default async function ProvidersPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const query = await searchParams;
  const d = getDictionary(locale);
  const treatment = typeof query.treatment === "string" ? query.treatment : "";
  const city = typeof query.city === "string" ? query.city : "";
  const language = typeof query.language === "string" ? query.language : "";
  const budget = Number(query.budget ?? 0);
  const currencyValue = (await cookies()).get("aurvia_currency")?.value ?? "EUR";
  const currency = isCurrency(currencyValue) ? currencyValue : "EUR";
  const rows = providers.filter((provider) => {
    if (treatment && !provider.treatmentSlugs.includes(treatment)) return false;
    if (city && provider.citySlug !== city) return false;
    if (language && !provider.languages.includes(language as Locale)) return false;
    if (budget > 0) {
      const prices = packages.filter((item) => item.providerSlug === provider.slug).map((item) => item.priceEur);
      if (!prices.some((price) => price <= budget)) return false;
    }
    return true;
  });
  return (
    <section className="px-5 py-12 md:px-10">
      <h1 className="serif text-5xl text-white">{d.nav.providers}</h1>
      <p className="mt-3 max-w-2xl text-faint">{d.home.providersBody}</p>
      <form className="mt-6 grid gap-3 md:grid-cols-5" method="get">
        <label>{d.hero.searchTreatment}
          <select name="treatment" defaultValue={treatment} className="mt-1 w-full rounded-xl bg-midnight px-3 py-3">
            <option value="">{d.provider.any}</option>
            {treatments.filter((item) => item.status === "open").map((item) => <option key={item.slug} value={item.slug}>{item.name[locale]}</option>)}
          </select>
        </label>
        <label>{d.provider.city}
          <select name="city" defaultValue={city} className="mt-1 w-full rounded-xl bg-midnight px-3 py-3">
            <option value="">{d.provider.any}</option>
            {destinations.map((item) => <option key={item.slug} value={item.slug}>{item.name[locale]}</option>)}
          </select>
        </label>
        <label>{d.provider.language}
          <select name="language" defaultValue={language} className="mt-1 w-full rounded-xl bg-midnight px-3 py-3">
            <option value="">{d.provider.any}</option>
            <option value="en">EN</option>
            <option value="de">DE</option>
            <option value="tr">TR</option>
          </select>
        </label>
        <label>{d.provider.budget}
          <input name="budget" type="number" min={0} defaultValue={budget || ""} className="mt-1 w-full rounded-xl bg-midnight px-3 py-3" />
        </label>
        <button className="self-end rounded-full bg-cyan px-4 py-3 font-semibold text-ink" type="submit">{d.hero.search}</button>
      </form>
      {rows.length === 0 ? (
        <p className="mt-8" role="status">{d.provider.empty} <Link className="text-cyan" href={localePath(locale, "/providers")}>{d.common.retry}</Link></p>
      ) : (
        <ul className="mt-8 grid gap-4 md:grid-cols-2">
          {rows.map((provider) => {
            const offer = packages.filter((item) => item.providerSlug === provider.slug).sort((a, b) => a.priceEur - b.priceEur)[0];
            return (
              <li key={provider.slug} className="glass rounded-3xl p-5">
                <p className="text-xs text-cyan">{d.demoBadge} · {d.provider.unverified}</p>
                <h2 className="mt-2 text-2xl text-white"><Link href={localePath(locale, `/providers/${provider.slug}`)}>{provider.name}</Link></h2>
                <p className="text-sm text-faint">{cityLabel(provider.citySlug, locale)} · {provider.languages.join(", ").toUpperCase()}</p>
                <p className="mt-2">{provider.summary[locale]}</p>
                {offer ? <p className="mt-3">{d.common.from} {formatMoney(convertFromEur(offer.priceEur, currency), currency, locale)}</p> : null}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
