import Link from "next/link";
import { notFound } from "next/navigation";
import { experiences } from "@/lib/demo/inventory";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { isLocale, localePath } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const d = getDictionary(locale);
  return pageMetadata(locale, d.nav.experiences, "/experiences", d.common.demoNotice);
}

export default async function ExperiencesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = getDictionary(locale);
  return (
    <section className="px-5 py-12 md:px-10">
      <h1 className="serif text-5xl text-white">{d.nav.experiences}</h1>
      <p className="mt-3 text-faint">{d.common.demoNotice}</p>
      <ul className="mt-8 grid gap-4 md:grid-cols-2">
        {experiences.map((item) => (
          <li key={item.id} className="rounded-3xl border border-line p-5">
            <p className="text-xs text-cyan">{d.demoBadge}</p>
            <h2 className="text-2xl text-white"><Link href={localePath(locale, `/experiences/${item.id}`)}>{item.name[locale]}</Link></h2>
            <p className="mt-2 text-faint">{item.summary[locale]}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
