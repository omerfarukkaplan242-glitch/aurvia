import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { isLocale } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const d = getDictionary(locale);
  return pageMetadata(locale, d.about.title, "/about", d.about.body);
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = getDictionary(locale);
  return (
    <article className="mx-auto max-w-3xl px-5 py-12">
      <h1 className="serif text-5xl text-white">{d.about.title}</h1>
      <p className="mt-6 text-lg">{d.about.body}</p>
      <p className="mt-6 text-sm text-faint">{d.disclaimerShort}</p>
    </article>
  );
}
