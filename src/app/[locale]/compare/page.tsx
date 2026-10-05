import Link from "next/link";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { cityLabel, packages, providers } from "@/lib/demo/inventory";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { isLocale, localePath } from "@/lib/i18n/config";
import { convertFromEur, formatMoney, isCurrency } from "@/lib/logic/currency";
import { pageMetadata } from "@/lib/seo";
import { TrackView } from "@/components/analytics/TrackView";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const d = getDictionary(locale);
  return pageMetadata(locale, d.compare.title, "/compare", d.compare.noRank);
}

export default async function ComparePage({
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
  const ids = (typeof query.ids === "string" ? query.ids : "").split(",").map((item) => item.trim()).filter(Boolean).slice(0, 4);
  const rows = ids.map((id) => providers.find((item) => item.slug === id)).filter((item) => item !== undefined);
  const currencyValue = (await cookies()).get("aurvia_currency")?.value ?? "EUR";
  const currency = isCurrency(currencyValue) ? currencyValue : "EUR";
  return (
    <section className="px-5 py-12 md:px-10">
      <h1 className="serif text-5xl text-white">{d.compare.title}</h1>
      <p className="mt-3 text-faint">{d.compare.noRank}</p>
      {rows.length === 0 ? (
        <p className="mt-8" role="status">{d.compare.empty} <Link className="text-cyan" href={localePath(locale, "/providers")}>{d.nav.providers}</Link></p>
      ) : (
        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left">
            <thead>
              <tr>
                <th className="p-3">{d.compare.location}</th>
                {rows.map((row) => <th key={row.slug} className="p-3 text-white">{row.name}</th>)}
              </tr>
            </thead>
            <tbody>
              <tr>
                <th className="p-3 font-normal text-faint">{d.demoBadge}</th>
                {rows.map((row) => <td key={row.slug} className="p-3">{d.demoBadge}</td>)}
              </tr>
              <tr>
                <th className="p-3 font-normal text-faint">{d.compare.location}</th>
                {rows.map((row) => <td key={row.slug} className="p-3">{cityLabel(row.citySlug, locale)}</td>)}
              </tr>
              <tr>
                <th className="p-3 font-normal text-faint">{d.compare.verification}</th>
                {rows.map((row) => <td key={row.slug} className="p-3">{d.provider.unverified}</td>)}
              </tr>
              <tr>
                <th className="p-3 font-normal text-faint">{d.compare.price}</th>
                {rows.map((row) => {
                  const offer = packages.filter((item) => item.providerSlug === row.slug).sort((a, b) => a.priceEur - b.priceEur)[0];
                  return <td key={row.slug} className="p-3">{offer ? formatMoney(convertFromEur(offer.priceEur, currency), currency, locale) : "—"}</td>;
                })}
              </tr>
              <tr>
                <th className="p-3 font-normal text-faint">{d.compare.hotel}</th>
                {rows.map((row) => <td key={row.slug} className="p-3">{packages.some((item) => item.providerSlug === row.slug && item.includesHotel) ? d.common.included : "—"}</td>)}
              </tr>
              <tr>
                <th className="p-3 font-normal text-faint">{d.compare.transfer}</th>
                {rows.map((row) => <td key={row.slug} className="p-3">{packages.some((item) => item.providerSlug === row.slug && item.includesTransfer) ? d.common.included : "—"}</td>)}
              </tr>
              <tr>
                <th className="p-3 font-normal text-faint">{d.compare.remove}</th>
                {rows.map((row) => {
                  const next = ids.filter((id) => id !== row.slug).join(",");
                  return <td key={row.slug} className="p-3"><Link href={localePath(locale, `/compare?ids=${next}`)}>{d.compare.remove}</Link></td>;
                })}
              </tr>
            </tbody>
          </table>
        </div>
      )}
      <TrackView locale={locale} event="comparison_started" />
    </section>
  );
}
