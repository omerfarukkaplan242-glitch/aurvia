import { notFound } from "next/navigation";
import { resetPassword } from "@/lib/actions";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { isLocale } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return pageMetadata(locale, getDictionary(locale).auth.resetTitle, "/reset", getDictionary(locale).auth.sent);
}

export default async function ResetPage({
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
    <section className="mx-auto max-w-md px-5 py-16">
      <h1 className="serif text-4xl text-white">{d.auth.resetTitle}</h1>
      {query.sent ? <p className="mt-4" role="status">{d.auth.sent}</p> : null}
      {query.error ? <p className="mt-4" role="alert">{d.common.error}</p> : null}
      <form action={resetPassword} className="mt-6 grid gap-3">
        <input type="hidden" name="locale" value={locale} />
        <label>{d.auth.email}<input name="email" type="email" required className="mt-1 w-full rounded-xl bg-midnight px-3 py-3" /></label>
        <button className="rounded-full bg-cyan px-4 py-3 font-semibold text-ink" type="submit">{d.common.submit}</button>
      </form>
    </section>
  );
}
