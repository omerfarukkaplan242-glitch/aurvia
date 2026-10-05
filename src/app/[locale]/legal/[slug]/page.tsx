import { notFound } from "next/navigation";
import { isLegalSlug, legalDocuments } from "@/lib/content/legal";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { isLocale } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!isLocale(locale) || !isLegalSlug(slug)) return {};
  const doc = legalDocuments[slug][locale];
  return pageMetadata(locale, doc.title, `/legal/${slug}`, doc.body[0]);
}

export default async function LegalPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!isLocale(locale) || !isLegalSlug(slug)) notFound();
  const doc = legalDocuments[slug][locale];
  const d = getDictionary(locale);
  return (
    <article className="mx-auto max-w-3xl px-5 py-12">
      <h1 className="serif text-5xl text-white">{doc.title}</h1>
      {doc.body.map((paragraph) => <p key={paragraph} className="mt-4 text-mist">{paragraph}</p>)}
      <p className="mt-8 text-sm text-faint">{d.disclaimerShort}</p>
    </article>
  );
}
