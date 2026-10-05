import Link from "next/link";
import { notFound } from "next/navigation";
import { signup } from "@/lib/actions";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { isLocale, localePath } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return pageMetadata(locale, getDictionary(locale).auth.signupTitle, "/signup", getDictionary(locale).tagline);
}

export default async function SignupPage({
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
      <h1 className="serif text-4xl text-white">{d.auth.signupTitle}</h1>
      {query.sent ? <p className="mt-4" role="status">{d.auth.verify}</p> : null}
      {query.error ? <p className="mt-4 text-cyan" role="alert">{d.common.error}</p> : null}
      <form action={signup} className="mt-6 grid gap-3">
        <input type="hidden" name="locale" value={locale} />
        <label>{d.auth.name}<input name="fullName" required minLength={2} autoComplete="name" className="mt-1 w-full rounded-xl bg-midnight px-3 py-3" /></label>
        <label>{d.auth.email}<input name="email" type="email" required autoComplete="email" className="mt-1 w-full rounded-xl bg-midnight px-3 py-3" /></label>
        <label>{d.auth.password}<input name="password" type="password" required minLength={8} autoComplete="new-password" className="mt-1 w-full rounded-xl bg-midnight px-3 py-3" /></label>
        <button className="rounded-full bg-cyan px-4 py-3 font-semibold text-ink" type="submit">{d.nav.signup}</button>
      </form>
      <p className="mt-4 text-sm">{d.auth.hasAccount} <Link className="text-cyan" href={localePath(locale, "/login")}>{d.nav.login}</Link></p>
    </section>
  );
}
