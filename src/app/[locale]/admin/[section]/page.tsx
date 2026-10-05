import { redirect, notFound } from "next/navigation";
import { saveCommission } from "@/lib/actions";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { isLocale, localePath } from "@/lib/i18n/config";
import { canAccessAdmin, isRole } from "@/lib/logic/authz";
import { createClient } from "@/lib/supabase/server";
import { pageMetadata } from "@/lib/seo";

export const sections = [
  "overview", "users", "providers", "treatments", "packages", "requests", "journeys",
  "flights", "hotels", "transfers", "cars", "tours", "documents", "messages",
  "transactions", "commissions", "coupons", "content", "translations", "analytics", "settings",
] as const;

const tables: Record<string, string> = {
  users: "profiles",
  providers: "providers",
  treatments: "treatments",
  packages: "packages",
  requests: "requests",
  journeys: "journeys",
  flights: "flight_offers",
  hotels: "hotel_offers",
  transfers: "transfer_offers",
  cars: "car_offers",
  tours: "experiences",
  documents: "documents",
  messages: "messages",
  transactions: "transactions",
  commissions: "commission_rules",
  coupons: "coupons",
  content: "content_pages",
  translations: "translations",
  analytics: "analytics_events",
  settings: "admin_settings",
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string; section: string }> }) {
  const { locale, section } = await params;
  if (!isLocale(locale)) return {};
  const d = getDictionary(locale);
  const key = sections.find((item) => item === section) ?? "overview";
  return pageMetadata(locale, d.admin.sections[key], `/admin/${key}`, d.admin.intro);
}

export default async function AdminSectionPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; section: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale, section } = await params;
  if (!isLocale(locale) || !sections.includes(section as (typeof sections)[number])) notFound();
  const query = await searchParams;
  const d = getDictionary(locale);
  const supabase = await createClient();
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;
  if (!user) redirect(localePath(locale, "/login"));
  const profile = (await supabase!.from("profiles").select("role").eq("id", user.id).maybeSingle()).data;
  const role = isRole(profile?.role) ? profile.role : null;
  if (!canAccessAdmin(role)) return <p className="px-5 py-16" role="alert">{d.common.unauthorized}</p>;
  const key = section as (typeof sections)[number];
  let rows: Record<string, unknown>[] = [];
  let error = false;
  if (key === "overview") {
    const { count } = await supabase!.from("providers").select("id", { count: "exact", head: true });
    rows = [{ providers: count ?? 0 }];
  } else {
    const table = tables[key];
    const result = await supabase!.from(table).select("*").limit(50);
    error = !!result.error;
    rows = result.data ?? [];
  }
  return (
    <section className="px-5 py-12 md:px-10">
      <h1 className="serif text-5xl text-white">{d.admin.title}</h1>
      <p className="mt-3 max-w-2xl text-faint">{d.admin.intro}</p>
      <nav aria-label={d.admin.title} className="mt-6 flex gap-3 overflow-x-auto text-sm">
        {sections.map((item) => (
          <a key={item} href={localePath(locale, `/admin/${item}`)} aria-current={item === key ? "page" : undefined} className={item === key ? "text-cyan" : ""}>{d.admin.sections[item]}</a>
        ))}
      </nav>
      <h2 className="mt-8 text-2xl text-white">{d.admin.sections[key]}</h2>
      {query.error ? <p role="alert">{d.common.error}</p> : null}
      {error ? <p role="alert">{d.common.error} <a href={localePath(locale, `/admin/${key}`)}>{d.common.retry}</a></p> : null}
      {!error && rows.length === 0 ? <p role="status">{d.common.empty}</p> : null}
      <ul className="mt-4 space-y-2 text-sm">
        {rows.map((row, index) => (
          <li key={String(row.id ?? index)} className="overflow-x-auto rounded-2xl border border-line p-3">
            <code>{JSON.stringify(row)}</code>
          </li>
        ))}
      </ul>
      {key === "commissions" ? (
        <form action={saveCommission} className="mt-6 grid max-w-lg gap-3">
          <input type="hidden" name="locale" value={locale} />
          <label>service
            <select name="service" className="mt-1 w-full rounded-xl bg-midnight px-3 py-2">
              {["treatment", "hotel", "transfer", "car", "esim", "insurance", "experience"].map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <label>mode
            <select name="mode" className="mt-1 w-full rounded-xl bg-midnight px-3 py-2"><option>percentage</option><option>fixed</option></select>
          </label>
          <label>value<input name="value" type="number" min={0} step="0.01" required className="mt-1 w-full rounded-xl bg-midnight px-3 py-2" /></label>
          <label>provider slug<input name="providerSlug" className="mt-1 w-full rounded-xl bg-midnight px-3 py-2" /></label>
          <button className="w-fit rounded-full bg-cyan px-4 py-2 font-semibold text-ink" type="submit">{d.common.save}</button>
        </form>
      ) : null}
    </section>
  );
}
