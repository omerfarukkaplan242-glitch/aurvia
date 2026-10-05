import Link from "next/link";
import { notFound } from "next/navigation";
import { cityLabel, packagesFor, providers } from "@/lib/demo/inventory";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { isLocale, localePath } from "@/lib/i18n/config";
import { convertFromEur, formatMoney, isCurrency } from "@/lib/logic/currency";
import { cookies } from "next/headers";
import { pageMetadata } from "@/lib/seo";
import { TrackView } from "@/components/analytics/TrackView";

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const provider = providers.find((item) => item.slug === slug);
  if (!provider) return {};
  return pageMetadata(locale, provider.name, `/providers/${slug}`, provider.summary[locale]);
}

export default async function ProviderPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const provider = providers.find((item) => item.slug === slug);
  if (!provider) notFound();
  const d = getDictionary(locale);
  const currencyValue = (await cookies()).get("aurvia_currency")?.value ?? "EUR";
  const currency = isCurrency(currencyValue) ? currencyValue : "EUR";
  const offers = packagesFor(provider.slug);
  return (
    <article className="px-5 py-12 md:px-10">
      <p className="text-xs uppercase tracking-[0.2em] text-cyan">{d.demoBadge}</p>
      <h1 className="serif mt-3 text-5xl text-white">{provider.name}</h1>
      <p className="mt-2 text-faint">{cityLabel(provider.citySlug, locale)} · {d.provider.unverified}</p>
      <p className="mt-4 max-w-3xl">{provider.summary[locale]}</p>
      <p className="mt-3 text-sm text-faint">{d.common.demoNotice}</p>
      <p className="mt-6">{d.provider.languages}: {provider.languages.join(", ").toUpperCase()}</p>
      <h2 className="serif mt-10 text-3xl text-white">{d.provider.packages}</h2>
      <ul className="mt-4 grid gap-4">
        {offers.map((offer) => (
          <li key={offer.slug} className="rounded-3xl border border-line p-5">
            <h3 className="text-xl text-white">{offer.title[locale]}</h3>
            <p className="mt-2 text-faint">{offer.summary[locale]}</p>
            <p className="mt-3">{formatMoney(convertFromEur(offer.priceEur, currency), currency, locale)} · {offer.nights} {d.common.nights}</p>
            <ul className="mt-3 text-sm text-faint">
              {offer.includesConsultation ? <li>{d.provider.consultation}</li> : null}
              {offer.includesHotel ? <li>{d.provider.hotel}</li> : null}
              {offer.includesTransfer ? <li>{d.provider.transfer}</li> : null}
            </ul>
            <div className="mt-4 flex gap-3">
              <Link className="rounded-full bg-cyan px-4 py-2 font-semibold text-ink" href={localePath(locale, `/trip?treatment=${offer.treatmentSlug}&provider=${provider.slug}`)}>{d.treatment.plan}</Link>
              <Link className="rounded-full border border-line px-4 py-2" href={localePath(locale, `/compare?ids=${provider.slug}`)}>{d.provider.compare}</Link>
            </div>
          </li>
        ))}
      </ul>
      <TrackView locale={locale} event="provider_view" providerSlug={provider.slug} />
    </article>
  );
}
