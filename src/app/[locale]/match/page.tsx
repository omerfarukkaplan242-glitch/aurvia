import Link from "next/link";
import { notFound } from "next/navigation";
import { packages, providers } from "@/lib/demo/inventory";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { isLocale, localePath } from "@/lib/i18n/config";
import { matchProviders } from "@/lib/logic/matching";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const d = getDictionary(locale);
  return pageMetadata(locale, d.match.title, "/match", d.match.notMedical);
}

export default async function MatchPage({
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
  const treatment = typeof query.treatment === "string" ? query.treatment : "hair-transplant";
  const city = typeof query.city === "string" ? query.city : "";
  const language = typeof query.language === "string" ? query.language : locale;
  const budget = Number(query.budget ?? 0);
  const matches = matchProviders(
    providers.map((provider) => ({
      slug: provider.slug,
      treatmentSlugs: provider.treatmentSlugs,
      citySlug: provider.citySlug,
      languages: provider.languages,
      packagePricesEur: packages.filter((item) => item.providerSlug === provider.slug).map((item) => item.priceEur),
      packageFeatures: packages.filter((item) => item.providerSlug === provider.slug).map((item) => ({ hotel: item.includesHotel, transfer: item.includesTransfer })),
    })),
    { treatmentSlug: treatment, destinationSlug: city || undefined, language, budgetMaxEur: budget || undefined },
  );
  return (
    <section className="px-5 py-12 md:px-10">
      <h1 className="serif text-5xl text-white">{d.match.title}</h1>
      <p className="mt-3 max-w-2xl">{d.match.intro}</p>
      <p className="mt-2 text-sm text-faint">{d.match.notMedical}</p>
      {matches.length === 0 ? <p className="mt-8" role="status">{d.match.empty}</p> : (
        <ol className="mt-8 space-y-4">
          {matches.map((match) => {
            const provider = providers.find((item) => item.slug === match.slug);
            if (!provider) return null;
            return (
              <li key={match.slug} className="glass rounded-3xl p-5">
                <p className="text-xs text-cyan">{d.demoBadge}</p>
                <h2 className="text-2xl text-white">{provider.name}</h2>
                <ul className="mt-3 list-disc pl-5 text-faint">
                  {match.reasons.map((reason) => <li key={reason}>{d.match.reasons[reason]}</li>)}
                </ul>
                <Link className="mt-4 inline-block text-cyan" href={localePath(locale, `/providers/${provider.slug}`)}>{d.provider.request}</Link>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
