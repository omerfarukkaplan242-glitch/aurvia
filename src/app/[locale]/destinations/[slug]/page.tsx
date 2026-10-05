import Link from "next/link";
import { notFound } from "next/navigation";
import { destinations, experiences, hotels, providers } from "@/lib/demo/inventory";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { isLocale, localePath } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const city = destinations.find((item) => item.slug === slug);
  if (!city) return {};
  return pageMetadata(locale, city.name[locale], `/destinations/${slug}`, city.summary[locale]);
}

export default async function DestinationPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const city = destinations.find((item) => item.slug === slug);
  if (!city) notFound();
  const d = getDictionary(locale);
  const localProviders = providers.filter((item) => item.citySlug === slug);
  const localHotels = hotels.filter((item) => item.citySlug === slug);
  const localExperiences = experiences.filter((item) => item.citySlug === slug);
  return (
    <article className="px-5 py-12 md:px-10">
      <h1 className="serif text-5xl text-white">{city.name[locale]}</h1>
      <p className="mt-4 max-w-2xl">{city.summary[locale]}</p>
      <p className="mt-3 text-sm text-faint">{d.common.demoNotice}</p>
      <h2 className="mt-8 text-2xl text-white">{d.nav.providers}</h2>
      {localProviders.length === 0 ? <p className="mt-2 text-faint">{d.provider.empty}</p> : localProviders.map((item) => <p key={item.slug}><Link className="text-cyan" href={localePath(locale, `/providers/${item.slug}`)}>{item.name}</Link></p>)}
      <h2 className="mt-8 text-2xl text-white">{d.trip.hotel}</h2>
      {localHotels.length === 0 ? <p className="text-faint">{d.common.empty}</p> : localHotels.map((item) => <p key={item.id}>{item.name} · {d.demoBadge}</p>)}
      <h2 className="mt-8 text-2xl text-white">{d.nav.experiences}</h2>
      {localExperiences.length === 0 ? <p className="text-faint">{d.common.empty}</p> : localExperiences.map((item) => <p key={item.id}><Link href={localePath(locale, `/experiences/${item.id}`)}>{item.name[locale]}</Link></p>)}
    </article>
  );
}
