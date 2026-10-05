import Link from "next/link";
import { notFound } from "next/navigation";
import { packages, providers, treatmentBySlug } from "@/lib/demo/inventory";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { isLocale, localePath } from "@/lib/i18n/config";
import { convertFromEur, formatMoney, isCurrency } from "@/lib/logic/currency";
import { cookies } from "next/headers";
import { pageMetadata } from "@/lib/seo";
import { TrackView } from "@/components/analytics/TrackView";

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const treatment = treatmentBySlug(slug);
  if (!treatment) return {};
  return pageMetadata(locale, treatment.name[locale], `/treatments/${slug}`, treatment.summary[locale]);
}

export default async function TreatmentPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const treatment = treatmentBySlug(slug);
  if (!treatment) notFound();
  const d = getDictionary(locale);
  const currencyValue = (await cookies()).get("aurvia_currency")?.value ?? "EUR";
  const currency = isCurrency(currencyValue) ? currencyValue : "EUR";
  const options = providers.filter((item) => item.treatmentSlugs.includes(slug));
  const sections = [
    [d.treatment.process, treatment.process[locale]],
    [d.treatment.journey, treatment.journey[locale]],
    [d.treatment.preparation, treatment.preparation[locale]],
    [d.treatment.recovery, treatment.recovery[locale]],
    [d.treatment.destination, treatment.destination[locale]],
  ];
  return (
    <article className="px-5 py-12 md:px-10">
      <p className="text-xs uppercase tracking-[0.2em] text-cyan">{treatment.status === "open" ? d.demoBadge : d.treatment.preview}</p>
      <h1 className="serif mt-3 text-5xl text-white">{treatment.name[locale]}</h1>
      <p className="mt-4 max-w-3xl text-lg text-mist">{treatment.summary[locale]}</p>
      <p className="mt-4 max-w-3xl text-sm text-faint">{d.disclaimerShort}</p>
      {treatment.status === "preview" ? <p className="mt-6 rounded-2xl border border-line p-4">{d.treatment.previewBody}</p> : null}
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {sections.map(([title, body]) => (
          <section key={title} className="rounded-3xl border border-line p-5">
            <h2 className="text-xl text-white">{title}</h2>
            <p className="mt-2 text-faint">{body}</p>
          </section>
        ))}
      </div>
      <h2 className="serif mt-12 text-3xl text-white">{d.treatment.providers}</h2>
      {options.length === 0 ? <p className="mt-4 text-faint">{d.match.empty}</p> : (
        <ul className="mt-4 grid gap-4">
          {options.map((provider) => {
            const offer = packages.find((item) => item.providerSlug === provider.slug && item.treatmentSlug === slug);
            return (
              <li key={provider.slug} className="glass rounded-3xl p-5">
                <p className="text-xs text-cyan">{d.demoBadge} · {d.provider.unverified}</p>
                <h3 className="mt-2 text-2xl text-white">{provider.name}</h3>
                <p className="mt-2 text-faint">{provider.summary[locale]}</p>
                {offer ? <p className="mt-3">{d.common.from} {formatMoney(convertFromEur(offer.priceEur, currency), currency, locale)} · {d.simulatedRates}</p> : null}
                <div className="mt-4 flex flex-wrap gap-3">
                  <Link className="rounded-full bg-cyan px-4 py-2 font-semibold text-ink" href={localePath(locale, `/providers/${provider.slug}`)}>{d.provider.request}</Link>
                  <Link className="rounded-full border border-line px-4 py-2" href={localePath(locale, `/compare?ids=${provider.slug}`)}>{d.treatment.compare}</Link>
                  <Link className="rounded-full border border-line px-4 py-2" href={localePath(locale, `/trip?treatment=${slug}&provider=${provider.slug}`)}>{d.treatment.plan}</Link>
                </div>
              </li>
            );
          })}
        </ul>
      )}
      <TrackView locale={locale} event="treatment_view" treatmentSlug={slug} />
    </article>
  );
}
