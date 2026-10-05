import { notFound } from "next/navigation";
import { experiences } from "@/lib/demo/inventory";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { isLocale } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const item = experiences.find((entry) => entry.id === slug);
  if (!item) return {};
  return pageMetadata(locale, item.name[locale], `/experiences/${slug}`, item.summary[locale]);
}

export default async function ExperiencePage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const item = experiences.find((entry) => entry.id === slug);
  if (!item) notFound();
  const d = getDictionary(locale);
  return (
    <article className="px-5 py-12 md:px-10">
      <p className="text-xs text-cyan">{d.demoBadge}</p>
      <h1 className="serif mt-3 text-5xl text-white">{item.name[locale]}</h1>
      <p className="mt-4 max-w-2xl">{item.summary[locale]}</p>
      <p className="mt-3 text-faint">{item.hours} h · EUR {item.priceEur} · {d.simulatedRates}</p>
    </article>
  );
}
