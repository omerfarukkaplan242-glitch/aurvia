import { redirect, notFound } from "next/navigation";
import { advanceJourney, respondToRequest, updatePackagePrice } from "@/lib/actions";
import { demoCommissionRules } from "@/lib/demo/inventory";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { isLocale, localePath } from "@/lib/i18n/config";
import { canAccessProviderPortal, isRole } from "@/lib/logic/authz";
import { calculateCommission, selectCommissionRule } from "@/lib/logic/commission";
import { createClient } from "@/lib/supabase/server";
import { pageMetadata } from "@/lib/seo";

const stages = ["consultation", "provider_selection", "trip_planning", "flight", "hotel", "transfer", "treatment", "recovery", "return", "completed"];

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return pageMetadata(locale, getDictionary(locale).portal.title, "/provider", getDictionary(locale).portal.empty);
}

export default async function ProviderPortalPage({
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
  const profile = (await supabase!.from("profiles").select("role, full_name").eq("id", user.id).maybeSingle()).data;
  const role = isRole(profile?.role) ? profile.role : null;
  if (!canAccessProviderPortal(role)) return <p className="px-5 py-16" role="alert">{d.common.unauthorized}</p>;
  const memberships = (await supabase!.from("provider_members").select("provider_id").eq("user_id", user.id)).data ?? [];
  const providerIds = memberships.map((item) => item.provider_id);
  const requests = providerIds.length
    ? (await supabase!.from("requests").select("id, status, treatment_slug, created_at").in("provider_id", providerIds).is("deleted_at", null)).data ?? []
    : [];
  const packageRows = providerIds.length
    ? (await supabase!.from("packages").select("id, title, price_eur, provider_id").in("provider_id", providerIds).is("deleted_at", null)).data ?? []
    : [];
  const journeys = providerIds.length
    ? (await supabase!.from("journeys").select("id, stage, title").in("provider_id", providerIds).is("deleted_at", null)).data ?? []
    : [];
  const rules = (await supabase!.from("commission_rules").select("id, service, mode, value, provider_slug").eq("service", "treatment")).data ?? [];
  const sample = selectCommissionRule(
    rules.map((rule) => ({ id: rule.id, service: rule.service, mode: rule.mode, value: Number(rule.value), providerId: rule.provider_slug })),
    "treatment",
    rules[0]?.provider_slug ?? null,
  ) ?? demoCommissionRules[0];
  return (
    <section className="px-5 py-12 md:px-10">
      <h1 className="serif text-5xl text-white">{d.portal.title}</h1>
      {query.sent ? <p role="status" className="mt-3">{d.common.success}</p> : null}
      {query.error ? <p role="alert" className="mt-3">{d.common.error}</p> : null}
      {providerIds.length === 0 ? <p className="mt-6" role="status">{d.portal.empty}</p> : null}
      <h2 className="mt-8 text-2xl text-white">{d.portal.requests}</h2>
      <ul className="mt-3 space-y-3">
        {requests.map((request) => (
          <li key={request.id} className="rounded-2xl border border-line p-4">
            <p>{request.treatment_slug} · {request.status}</p>
            <form action={respondToRequest}>
              <input type="hidden" name="locale" value={locale} />
              <input type="hidden" name="requestId" value={request.id} />
              <button className="mt-2 text-cyan" type="submit">{d.portal.respond}</button>
            </form>
          </li>
        ))}
      </ul>
      <h2 className="mt-8 text-2xl text-white">{d.portal.packages}</h2>
      <ul className="mt-3 space-y-3">
        {packageRows.map((item) => (
          <li key={item.id}>
            <form action={updatePackagePrice} className="flex flex-wrap items-end gap-3">
              <input type="hidden" name="locale" value={locale} />
              <input type="hidden" name="packageId" value={item.id} />
              <label>{item.title}
                <input name="priceEur" type="number" min={0} defaultValue={item.price_eur} className="mt-1 block rounded-xl bg-midnight px-3 py-2" />
              </label>
              <button className="rounded-full border border-line px-3 py-2" type="submit">{d.common.save}</button>
            </form>
          </li>
        ))}
      </ul>
      <h2 className="mt-8 text-2xl text-white">{d.portal.journey}</h2>
      <ul className="mt-3 space-y-3">
        {journeys.map((journey) => (
          <li key={journey.id}>
            <form action={advanceJourney} className="flex flex-wrap gap-3">
              <input type="hidden" name="locale" value={locale} />
              <input type="hidden" name="journeyId" value={journey.id} />
              <label>{journey.title}
                <select name="stage" defaultValue={journey.stage} className="ml-2 rounded-xl bg-midnight px-3 py-2">
                  {stages.map((stage) => <option key={stage}>{stage}</option>)}
                </select>
              </label>
              <button type="submit">{d.common.save}</button>
            </form>
          </li>
        ))}
      </ul>
      <h2 className="mt-8 text-2xl text-white">{d.portal.commission}</h2>
      <p className="mt-2 text-faint">{d.demoBadge}. {sample.mode} {sample.value}. {d.common.from} EUR 1000 → {calculateCommission(1000, { ...sample, providerId: sample.providerId ?? null })}</p>
    </section>
  );
}
