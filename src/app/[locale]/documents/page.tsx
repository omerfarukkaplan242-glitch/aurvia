import { redirect, notFound } from "next/navigation";
import { DocumentVault } from "@/components/documents/DocumentVault";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { isLocale, localePath } from "@/lib/i18n/config";
import { canAccessPatientArea, isRole } from "@/lib/logic/authz";
import { createClient } from "@/lib/supabase/server";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return pageMetadata(locale, getDictionary(locale).documents.title, "/documents", getDictionary(locale).documents.private);
}

export default async function DocumentsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = getDictionary(locale);
  const supabase = await createClient();
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;
  if (!user) redirect(localePath(locale, "/login"));
  const profile = (await supabase!.from("profiles").select("role").eq("id", user.id).maybeSingle()).data;
  const role = isRole(profile?.role) ? profile.role : "patient";
  if (!canAccessPatientArea(role) && role !== "provider" && role !== "provider_staff") {
    return <p className="px-5 py-16" role="alert">{d.common.unauthorized}</p>;
  }
  return (
    <section className="px-5 py-12 md:px-10">
      <h1 className="serif text-5xl text-white">{d.documents.title}</h1>
      <div className="mt-6 max-w-3xl"><DocumentVault d={d} /></div>
    </section>
  );
}
