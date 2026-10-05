import Link from "next/link";
import { notFound } from "next/navigation";
import { destinations, experiences } from "@/lib/demo/inventory";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { isLocale, localePath } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const d = getDictionary(locale);
  return pageMetadata(locale, d.nav.destinations, "/destinations", d.home.destinationsTitle);
}

export default async function DestinationsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = getDictionary(locale);
  return (
    <section className="px-5 py-12 md:px-10">
      <h1 className="serif text-5xl text-white">{d.home.destinationsTitle}</h1>
      <ul className="mt-8 grid gap-4 md:grid-cols-3">
        {destinations.map((city) => (
          <li key={city.slug}><Link className="glass block rounded-3xl p-5" href={localePath(locale, `/destinations/${city.slug}`)}><h2 className="text-2xl text-white">{city.name[locale]}</h2><p className="mt-2 text-faint">{city.summary[locale]}</p></Link></li>
        ))}
      </ul>
      <p className="mt-6 text-sm text-faint">{experiences.length} {d.demoBadge}</p>
    </section>
  );
}
