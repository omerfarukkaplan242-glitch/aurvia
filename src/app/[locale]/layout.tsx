import { cookies, headers } from "next/headers";
import { notFound } from "next/navigation";
import { isCurrency, type Currency } from "@/lib/logic/currency";
import { isLocale, LOCALES, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { createClient } from "@/lib/supabase/server";
import { SiteFooter, SiteHeader } from "@/components/chrome/SiteChrome";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  const dictionary = getDictionary(locale);
  const jar = await cookies();
  const currencyValue = jar.get("aurvia_currency")?.value ?? "EUR";
  const currency: Currency = isCurrency(currencyValue) ? currencyValue : "EUR";
  const path = (await headers()).get("x-aurvia-path") || `/${locale}`;
  const supabase = await createClient();
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;
  return (
    <div className="min-h-screen">
      <SiteHeader locale={locale} d={dictionary} currency={currency} signedIn={!!user} path={path} />
      <main id="content">{children}</main>
      <SiteFooter locale={locale} d={dictionary} />
    </div>
  );
}
