import { redirect, notFound } from "next/navigation";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { isLocale, localePath } from "@/lib/i18n/config";
import { createClient } from "@/lib/supabase/server";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return pageMetadata(locale, getDictionary(locale).notifications.title, "/notifications", getDictionary(locale).notifications.empty);
}

export default async function NotificationsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = getDictionary(locale);
  const supabase = await createClient();
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;
  if (!user) redirect(localePath(locale, "/login"));
  const { data, error } = await supabase!.from("notifications").select("id, kind, title, body, created_at, read_at").order("created_at", { ascending: false }).limit(50);
  return (
    <section className="px-5 py-12 md:px-10">
      <h1 className="serif text-5xl text-white">{d.notifications.title}</h1>
      {error ? <p role="alert" className="mt-4">{d.common.error}</p> : null}
      {!error && (data ?? []).length === 0 ? <p className="mt-6" role="status">{d.notifications.empty}</p> : null}
      <ul className="mt-6 space-y-3">
        {(data ?? []).map((item) => (
          <li key={item.id} className="rounded-2xl border border-line px-4 py-3">
            <p className="text-white">{item.title}</p>
            <p className="text-sm text-faint">{item.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
