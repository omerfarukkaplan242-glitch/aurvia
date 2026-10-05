import Link from "next/link";
import { notFound } from "next/navigation";
import { treatments } from "@/lib/demo/inventory";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { isLocale, localePath } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return pageMetadata(locale, getDictionary(locale).nav.treatments, "/treatments", getDictionary(locale).home.treatmentsBody);
}

export default async function TreatmentsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = getDictionary(locale);
  return (
    <section className="px-5 py-12 md:px-10">
      <h1 className="serif text-5xl text-white">{d.nav.treatments}</h1>
      <p className="mt-4 max-w-2xl text-faint">{d.home.treatmentsBody}</p>
      <ul className="mt-8 grid gap-4 md:grid-cols-2">
        {treatments.map((item) => (
          <li key={item.slug}>
            <Link href={localePath(locale, `/treatments/${item.slug}`)} className="glass block rounded-3xl p-6">
              <p className="text-xs uppercase tracking-[0.18em] text-cyan">{item.status === "open" ? d.demoBadge : d.treatment.preview}</p>
              <h2 className="mt-3 text-2xl text-white">{item.name[locale]}</h2>
              <p className="mt-2 text-faint">{item.summary[locale]}</p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
