import Link from "next/link";
import { destinations, treatments } from "@/lib/demo/inventory";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { localePath, type Locale } from "@/lib/i18n/config";
import { GlobeSlot } from "./GlobeSlot";
import { Reveal } from "./Reveal";

export function HomeExperience({ locale, d }: { locale: Locale; d: Dictionary }) {
  const openTreatments = treatments.filter((item) => item.status === "open");
  return (
    <div>
      <section className="grid items-center gap-10 px-5 py-16 md:grid-cols-[1.1fr_0.9fr] md:px-10 md:py-24">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-cyan">{d.hero.eyebrow}</p>
          <h1 className="serif mt-4 max-w-3xl text-5xl leading-[1.05] text-white md:text-7xl">{d.hero.title}</h1>
          <p className="mt-6 max-w-xl text-lg text-mist/90">{d.hero.body}</p>
          <form action={localePath(locale, "/providers")} className="glass mt-8 grid gap-3 rounded-3xl p-4 md:grid-cols-[1fr_1fr_auto]">
            <label className="text-sm">
              <span className="mb-1 block text-faint">{d.hero.searchTreatment}</span>
              <select name="treatment" className="w-full rounded-xl bg-ink px-3 py-3" defaultValue="hair-transplant">
                {openTreatments.map((item) => (
                  <option key={item.slug} value={item.slug}>{item.name[locale]}</option>
                ))}
              </select>
            </label>
            <label className="text-sm">
              <span className="mb-1 block text-faint">{d.hero.searchCity}</span>
              <select name="city" className="w-full rounded-xl bg-ink px-3 py-3" defaultValue="">
                <option value="">{d.hero.anyCity}</option>
                {destinations.map((city) => (
                  <option key={city.slug} value={city.slug}>{city.name[locale]}</option>
                ))}
              </select>
            </label>
            <button className="self-end rounded-full bg-cyan px-5 py-3 font-semibold text-ink" type="submit">{d.hero.search}</button>
          </form>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link className="rounded-full bg-white px-5 py-3 font-semibold text-ink" href={localePath(locale, "/trip")}>{d.hero.primary}</Link>
            <Link className="rounded-full border border-line px-5 py-3" href={localePath(locale, "/treatments")}>{d.hero.secondary}</Link>
          </div>
        </div>
        <div className="relative h-[420px] md:h-[560px]">
          <div className="absolute inset-8 rounded-full bg-violet/10 blur-3xl" aria-hidden="true" />
          <GlobeSlot />
          <p className="sr-only">Abstract route from a patient toward Türkiye, a provider, and the return journey.</p>
        </div>
      </section>

      <section className="px-5 py-16 md:px-10" aria-labelledby="story-title">
        <h2 id="story-title" className="serif text-4xl text-white">{d.story.title}</h2>
        <ol className="mt-8 grid gap-4 md:grid-cols-3">
          {d.story.steps.map((step, index) => (
            <Reveal key={step.title}>
              <li className="glass h-full rounded-3xl p-6">
                <Link href={localePath(locale, ["/treatments", "/providers", "/compare", "/trip", "/destinations", "/journey"][index] ?? "/treatments")} className="block h-full">
                  <p className="text-cyan">0{index + 1}</p>
                  <h3 className="mt-3 text-xl text-white">{step.title}</h3>
                  <p className="mt-2 text-faint">{step.body}</p>
                </Link>
              </li>
            </Reveal>
          ))}
        </ol>
      </section>

      <section className="px-5 py-8 md:px-10">
        <h2 className="serif text-4xl text-white">{d.home.treatmentsTitle}</h2>
        <p className="mt-3 max-w-2xl text-faint">{d.home.treatmentsBody}</p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {openTreatments.map((item) => (
            <Link key={item.slug} href={localePath(locale, `/treatments/${item.slug}`)} className="glass rounded-3xl p-6 hover:border-cyan/40">
              <p className="text-xs uppercase tracking-[0.2em] text-cyan">{d.demoBadge}</p>
              <h3 className="mt-3 text-2xl text-white">{item.name[locale]}</h3>
              <p className="mt-2 text-faint">{item.summary[locale]}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-6 px-5 py-16 md:grid-cols-2 md:px-10">
        <article className="rounded-3xl border border-line p-8">
          <h2 className="serif text-3xl text-white">{d.home.matchTitle}</h2>
          <p className="mt-3 text-faint">{d.home.matchBody}</p>
          <Link className="mt-5 inline-block text-cyan" href={localePath(locale, "/match?treatment=hair-transplant")}>{d.home.matchCta}</Link>
        </article>
        <article className="rounded-3xl border border-line p-8">
          <h2 className="serif text-3xl text-white">{d.home.trustTitle}</h2>
          <p className="mt-3 text-faint">{d.home.trustBody}</p>
          <Link className="mt-5 inline-block text-cyan" href={localePath(locale, "/about")}>{d.home.trustCta}</Link>
        </article>
      </section>
    </div>
  );
}
