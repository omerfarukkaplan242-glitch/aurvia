import { notFound } from "next/navigation";
import { sendContact } from "@/lib/actions";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { isLocale } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return pageMetadata(locale, getDictionary(locale).contact.title, "/contact", getDictionary(locale).tagline);
}

export default async function ContactPage({
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
  return (
    <section className="mx-auto max-w-xl px-5 py-12">
      <h1 className="serif text-5xl text-white">{d.contact.title}</h1>
      {query.sent ? <p className="mt-4" role="status">{d.contact.sent}</p> : null}
      {query.error ? <p className="mt-4" role="alert">{d.common.error}</p> : null}
      <form action={sendContact} className="mt-6 grid gap-3">
        <input type="hidden" name="locale" value={locale} />
        <label className="hidden" aria-hidden="true">{d.contact.company}<input name="company" tabIndex={-1} autoComplete="off" /></label>
        <label>{d.contact.name}<input name="name" required className="mt-1 w-full rounded-xl bg-midnight px-3 py-3" /></label>
        <label>{d.contact.email}<input name="email" type="email" required className="mt-1 w-full rounded-xl bg-midnight px-3 py-3" /></label>
        <label>{d.contact.message}<textarea name="message" required minLength={10} className="mt-1 w-full rounded-xl bg-midnight px-3 py-3" /></label>
        <button className="w-fit rounded-full bg-cyan px-4 py-3 font-semibold text-ink" type="submit">{d.common.submit}</button>
      </form>
    </section>
  );
}
