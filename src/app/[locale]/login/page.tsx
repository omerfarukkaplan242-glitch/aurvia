import Link from "next/link";
import { notFound } from "next/navigation";
import { login } from "@/lib/actions";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { isLocale, localePath } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/seo";

function AuthShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mx-auto max-w-md px-5 py-16">
      <h1 className="serif text-4xl text-white">{title}</h1>
      <div className="mt-6">{children}</div>
    </section>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return pageMetadata(locale, getDictionary(locale).auth.loginTitle, "/login", getDictionary(locale).tagline);
}

export default async function LoginPage({
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
  const next = typeof query.next === "string" ? query.next : "";
  return (
    <AuthShell title={d.auth.loginTitle}>
      {query.error ? <p role="alert" className="mb-4 text-cyan">{d.common.error}</p> : null}
      <form action={login} className="grid gap-3">
        <input type="hidden" name="locale" value={locale} />
        <input type="hidden" name="next" value={next} />
        <label>{d.auth.email}<input name="email" type="email" autoComplete="email" required className="mt-1 w-full rounded-xl bg-midnight px-3 py-3" /></label>
        <label>{d.auth.password}<input name="password" type="password" autoComplete="current-password" minLength={8} required className="mt-1 w-full rounded-xl bg-midnight px-3 py-3" /></label>
        <button className="rounded-full bg-cyan px-4 py-3 font-semibold text-ink" type="submit">{d.nav.login}</button>
      </form>
      <p className="mt-4 text-sm"><Link href={localePath(locale, "/reset")}>{d.auth.forgot}</Link></p>
      <p className="mt-2 text-sm">{d.auth.noAccount} <Link className="text-cyan" href={localePath(locale, next ? `/signup?next=${encodeURIComponent(next)}` : "/signup")}>{d.nav.signup}</Link></p>
    </AuthShell>
  );
}
