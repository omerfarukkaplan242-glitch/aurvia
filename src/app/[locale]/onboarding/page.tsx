import { redirect, notFound } from "next/navigation";
import { destinations, treatments } from "@/lib/demo/inventory";
import { saveOnboarding } from "@/lib/actions";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { isLocale, localePath } from "@/lib/i18n/config";
import { CURRENCIES } from "@/lib/logic/currency";
import { canAccessPatientArea, isRole } from "@/lib/logic/authz";
import { createClient } from "@/lib/supabase/server";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return pageMetadata(locale, getDictionary(locale).onboard.title, "/onboarding", getDictionary(locale).onboard.body);
}

export default async function OnboardingPage({
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
  const supabase = await createClient();
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;
  if (!user) redirect(localePath(locale, "/login"));
  const profile = supabase ? (await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle()).data : null;
  const role = isRole(profile?.role) ? profile.role : "patient";
  if (!canAccessPatientArea(role)) {
    return <p className="px-5 py-16" role="alert">{d.common.unauthorized}</p>;
  }
  const open = treatments.filter((item) => item.status === "open");
  return (
    <section className="mx-auto max-w-2xl px-5 py-12">
      <h1 className="serif text-4xl text-white">{d.onboard.title}</h1>
      <p className="mt-3 text-faint">{d.onboard.body}</p>
      {query.error ? <p className="mt-4" role="alert">{d.common.error}</p> : null}
      <form action={saveOnboarding} className="mt-6 grid gap-4">
        <input type="hidden" name="locale" value={locale} />
        <label>{d.onboard.country}<input name="country" required className="mt-1 w-full rounded-xl bg-midnight px-3 py-3" /></label>
        <label>{d.onboard.language}
          <select name="language" defaultValue={locale} className="mt-1 w-full rounded-xl bg-midnight px-3 py-3">
            <option value="en">English</option><option value="de">Deutsch</option><option value="tr">Türkçe</option>
          </select>
        </label>
        <label>{d.onboard.currency}
          <select name="currency" defaultValue="EUR" className="mt-1 w-full rounded-xl bg-midnight px-3 py-3">{CURRENCIES.map((item) => <option key={item}>{item}</option>)}</select>
        </label>
        <label>{d.onboard.treatment}
          <select name="treatmentSlug" className="mt-1 w-full rounded-xl bg-midnight px-3 py-3">{open.map((item) => <option key={item.slug} value={item.slug}>{item.name[locale]}</option>)}</select>
        </label>
        <label>{d.onboard.destination}
          <select name="destinationSlug" className="mt-1 w-full rounded-xl bg-midnight px-3 py-3">{destinations.map((item) => <option key={item.slug} value={item.slug}>{item.name[locale]}</option>)}</select>
        </label>
        <label>{d.onboard.dates}<input name="travelWindow" required placeholder="2026-11" className="mt-1 w-full rounded-xl bg-midnight px-3 py-3" /></label>
        <label>{d.onboard.budget}<input name="budgetMax" type="number" min={0} required className="mt-1 w-full rounded-xl bg-midnight px-3 py-3" /></label>
        <label>{d.onboard.travelers}<input name="travelers" type="number" min={1} max={12} defaultValue={1} required className="mt-1 w-full rounded-xl bg-midnight px-3 py-3" /></label>
        <label>{d.onboard.hotel}<input name="hotelPreference" className="mt-1 w-full rounded-xl bg-midnight px-3 py-3" /></label>
        <label>{d.onboard.flight}<input name="flightPreference" className="mt-1 w-full rounded-xl bg-midnight px-3 py-3" /></label>
        <label>{d.onboard.transfer}<input name="transferPreference" className="mt-1 w-full rounded-xl bg-midnight px-3 py-3" /></label>
        <label>{d.onboard.notes}
          <textarea name="notes" maxLength={1000} className="mt-1 w-full rounded-xl bg-midnight px-3 py-3" />
          <span className="text-xs text-faint">{d.onboard.notesHint}</span>
        </label>
        <button className="w-fit rounded-full bg-cyan px-5 py-3 font-semibold text-ink" type="submit">{d.common.save}</button>
      </form>
    </section>
  );
}
