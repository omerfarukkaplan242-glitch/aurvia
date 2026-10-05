import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { isLocale, localePath } from "@/lib/i18n/config";
import { canAccessPatientArea, isRole } from "@/lib/logic/authz";
import { createClient } from "@/lib/supabase/server";
import { pageMetadata } from "@/lib/seo";

const stageOrder = ["consultation", "provider_selection", "trip_planning", "flight", "hotel", "transfer", "treatment", "recovery", "return"] as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return pageMetadata(locale, getDictionary(locale).journey.title, "/journey", getDictionary(locale).journey.empty);
}

export default async function JourneyPage({
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
  const profile = (await supabase!.from("profiles").select("role").eq("id", user.id).maybeSingle()).data;
  const role = isRole(profile?.role) ? profile.role : "patient";
  if (!canAccessPatientArea(role)) return <p className="px-5 py-16" role="alert">{d.common.unauthorized}</p>;
  const { data: journeys, error } = await supabase!.from("journeys").select("id, title, stage, created_at").eq("patient_id", user.id).is("deleted_at", null).order("created_at", { ascending: false });
  return (
    <section className="px-5 py-12 md:px-10">
      <h1 className="serif text-5xl text-white">{d.journey.title}</h1>
      {query.sent ? <p className="mt-4" role="status">{d.common.success}</p> : null}
      {error ? <p className="mt-4" role="alert">{d.common.error} <Link href={localePath(locale, "/journey")}>{d.common.retry}</Link></p> : null}
      {!error && (journeys ?? []).length === 0 ? <p className="mt-6" role="status">{d.journey.empty}</p> : null}
      <div className="mt-8 space-y-8">
        {(journeys ?? []).map((journey) => {
          const index = stageOrder.indexOf(journey.stage as (typeof stageOrder)[number]);
          return (
            <article key={journey.id} className="glass rounded-3xl p-6">
              <h2 className="text-2xl text-white">{journey.title}</h2>
              <p className="mt-2 text-sm text-faint">{d.journey.progress}</p>
              <ol className="mt-4 grid gap-2 md:grid-cols-3">
                {d.journey.stages.map((label, step) => (
                  <li key={label} className={step <= index ? "rounded-2xl bg-cyan/15 px-3 py-3 text-white" : "rounded-2xl border border-line px-3 py-3 text-faint"} aria-current={step === index ? "step" : undefined}>
                    {label}
                  </li>
                ))}
              </ol>
              <div className="mt-4 flex gap-4 text-sm">
                <Link href={localePath(locale, "/documents")}>{d.journey.documents}</Link>
                <Link href={localePath(locale, "/messages")}>{d.journey.messages}</Link>
                <Link href={localePath(locale, "/notifications")}>{d.notifications.title}</Link>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
