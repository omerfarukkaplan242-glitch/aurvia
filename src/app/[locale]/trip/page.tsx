import Link from "next/link";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import {
  cars,
  cityLabel,
  esims,
  experiences,
  flights,
  hotels,
  insurancePlans,
  packages,
  providers,
  transfers,
  treatments,
} from "@/lib/demo/inventory";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { isLocale, localePath } from "@/lib/i18n/config";
import { convertFromEur, formatMoney, isCurrency } from "@/lib/logic/currency";
import { tripTotalEur, type TripLine } from "@/lib/logic/trip";
import { submitRequest } from "@/lib/actions";
import { pageMetadata } from "@/lib/seo";
import { TrackView } from "@/components/analytics/TrackView";

function one(value: string | string[] | undefined): string {
  return typeof value === "string" ? value : "";
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const d = getDictionary(locale);
  return pageMetadata(locale, d.trip.title, "/trip", d.trip.simulated);
}

export default async function TripPage({
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
  const currencyValue = (await cookies()).get("aurvia_currency")?.value ?? "EUR";
  const currency = isCurrency(currencyValue) ? currencyValue : "EUR";
  const treatment = one(query.treatment) || "hair-transplant";
  const providerSlug = one(query.provider);
  const flightId = one(query.flight);
  const hotelId = one(query.hotel);
  const transferId = one(query.transfer);
  const carId = one(query.car);
  const esimId = one(query.esim);
  const insuranceId = one(query.insurance);
  const experienceId = one(query.experience);
  const nights = Math.max(1, Number(one(query.nights) || 3));
  const provider = providers.find((item) => item.slug === providerSlug);
  const offer = packages.find((item) => item.providerSlug === providerSlug && item.treatmentSlug === treatment);
  const flight = flights.find((item) => item.id === flightId);
  const hotel = hotels.find((item) => item.id === hotelId);
  const transfer = transfers.find((item) => item.id === transferId);
  const car = cars.find((item) => item.id === carId);
  const esim = esims.find((item) => item.id === esimId);
  const insurance = insurancePlans.find((item) => item.id === insuranceId);
  const experience = experiences.find((item) => item.id === experienceId);
  const lines: TripLine[] = [];
  if (offer) lines.push({ kind: "treatment", id: offer.slug, label: offer.title[locale], amountEur: offer.priceEur, simulated: true });
  if (flight) lines.push({ kind: "flight", id: flight.id, label: `${flight.airline} ${flight.origin}-${flight.destination}`, amountEur: flight.priceEur, simulated: true });
  if (hotel) lines.push({ kind: "hotel", id: hotel.id, label: hotel.name, amountEur: hotel.pricePerNightEur * nights, simulated: true });
  if (transfer) lines.push({ kind: "transfer", id: transfer.id, label: transfer.vehicle, amountEur: transfer.priceEur, simulated: true });
  if (car) lines.push({ kind: "car", id: car.id, label: car.name, amountEur: car.pricePerDayEur * nights, simulated: true });
  if (esim) lines.push({ kind: "esim", id: esim.id, label: esim.name, amountEur: esim.priceEur, simulated: true });
  if (insurance) lines.push({ kind: "insurance", id: insurance.id, label: insurance.name[locale], amountEur: insurance.priceEur, simulated: true });
  if (experience) lines.push({ kind: "experience", id: experience.id, label: experience.name[locale], amountEur: experience.priceEur, simulated: true });
  const total = tripTotalEur(lines);
  const keep = new URLSearchParams({ treatment, nights: String(nights) });
  if (providerSlug) keep.set("provider", providerSlug);
  if (flightId) keep.set("flight", flightId);
  if (hotelId) keep.set("hotel", hotelId);
  if (transferId) keep.set("transfer", transferId);
  const money = (amount: number) => formatMoney(convertFromEur(amount, currency), currency, locale);
  const city = provider?.citySlug;
  return (
    <section className="px-5 py-12 md:px-10">
      <p className="text-xs uppercase tracking-[0.2em] text-cyan">{d.demoBadge}</p>
      <h1 className="serif mt-3 text-5xl text-white">{d.trip.title}</h1>
      <p className="mt-3 max-w-2xl text-faint">{d.trip.simulated}</p>
      <ol className="mt-6 flex flex-wrap gap-2 text-sm">
        {d.trip.steps.map((step) => <li key={step} className="rounded-full border border-line px-3 py-1">{step}</li>)}
      </ol>
      {query.error ? <p className="mt-4 text-cyan" role="alert">{d.common.error}. <Link href={localePath(locale, "/trip")}>{d.common.retry}</Link></p> : null}

      <h2 className="mt-10 text-2xl text-white">{d.trip.treatment}</h2>
      <div className="mt-3 flex flex-wrap gap-2">
        {treatments.filter((item) => item.status === "open").map((item) => (
          <Link key={item.slug} className={item.slug === treatment ? "rounded-full bg-cyan px-3 py-2 text-ink" : "rounded-full border border-line px-3 py-2"} href={localePath(locale, `/trip?treatment=${item.slug}`)}>{item.name[locale]}</Link>
        ))}
      </div>

      <h2 className="mt-10 text-2xl text-white">{d.trip.provider}</h2>
      <ul className="mt-3 grid gap-3 md:grid-cols-2">
        {providers.filter((item) => item.treatmentSlugs.includes(treatment)).map((item) => (
          <li key={item.slug}>
            <Link className={item.slug === providerSlug ? "glass block rounded-2xl border-cyan p-4" : "block rounded-2xl border border-line p-4"} href={`${localePath(locale, "/trip")}?${new URLSearchParams({ ...Object.fromEntries(keep), provider: item.slug })}`}>
              <span className="text-xs text-cyan">{d.demoBadge}</span>
              <span className="mt-1 block text-white">{item.name}</span>
              <span className="text-sm text-faint">{cityLabel(item.citySlug, locale)}</span>
            </Link>
          </li>
        ))}
      </ul>

      <h2 className="mt-10 text-2xl text-white">{d.trip.flight}</h2>
      <ul className="mt-3 grid gap-3">
        {flights.map((item) => (
          <li key={item.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line p-4">
            <span>{item.airline} · {item.origin} → {item.destination} · {item.durationMinutes} min · {item.baggage}</span>
            <span>{money(item.priceEur)}</span>
            <Link href={`${localePath(locale, "/trip")}?${new URLSearchParams({ ...Object.fromEntries(keep), flight: item.id })}`}>{flightId === item.id ? d.trip.selected : d.trip.select}</Link>
          </li>
        ))}
      </ul>

      <h2 className="mt-10 text-2xl text-white">{d.trip.hotel}</h2>
      <ul className="mt-3 grid gap-3 md:grid-cols-2">
        {hotels.filter((item) => !city || item.citySlug === city).map((item) => (
          <li key={item.id} className="rounded-2xl border border-line p-4">
            <p className="text-xs text-cyan">{d.demoBadge}</p>
            <h3 className="text-white">{item.name}</h3>
            <p className="text-sm text-faint">{item.roomType} · {item.rating} · {item.cancellation[locale]}</p>
            <p className="mt-2">{money(item.pricePerNightEur)} / {d.common.nights}</p>
            <Link href={`${localePath(locale, "/trip")}?${new URLSearchParams({ ...Object.fromEntries(keep), hotel: item.id })}`}>{hotelId === item.id ? d.trip.selected : d.trip.select}</Link>
          </li>
        ))}
      </ul>

      <h2 className="mt-10 text-2xl text-white">{d.trip.transfer}</h2>
      <ul className="mt-3 grid gap-3">
        {transfers.filter((item) => !city || item.citySlug === city).map((item) => (
          <li key={item.id} className="rounded-2xl border border-line p-4">
            {item.vehicle} · {item.route.replaceAll("_", " → ")} · {item.passengers} · {item.durationMinutes} min · {money(item.priceEur)}
            <Link className="ml-3 text-cyan" href={`${localePath(locale, "/trip")}?${new URLSearchParams({ ...Object.fromEntries(keep), transfer: item.id })}`}>{transferId === item.id ? d.trip.selected : d.trip.select}</Link>
          </li>
        ))}
      </ul>

      <h2 className="mt-10 text-2xl text-white">{d.trip.extras}</h2>
      <div className="mt-3 grid gap-4 md:grid-cols-2">
        <div>
          <h3>{d.trip.car}</h3>
          {cars.filter((item) => !city || item.citySlug === city).map((item) => (
            <p key={item.id}><Link href={`${localePath(locale, "/trip")}?${new URLSearchParams({ ...Object.fromEntries(keep), car: item.id })}`}>{item.name}</Link> · {item.transmission} · {item.seats} · {money(item.pricePerDayEur)}</p>
          ))}
        </div>
        <div>
          <h3>{d.trip.esim}</h3>
          {esims.map((item) => <p key={item.id}><Link href={`${localePath(locale, "/trip")}?${new URLSearchParams({ ...Object.fromEntries(keep), esim: item.id })}`}>{item.name}</Link> · {item.dataGb}GB · {item.days}d</p>)}
          <h3 className="mt-4">{d.trip.insurance}</h3>
          <p className="text-sm text-faint">{d.trip.insuranceNote}</p>
          {insurancePlans.map((item) => <p key={item.id}><Link href={`${localePath(locale, "/trip")}?${new URLSearchParams({ ...Object.fromEntries(keep), insurance: item.id })}`}>{item.name[locale]}</Link></p>)}
          <h3 className="mt-4">{d.trip.experience}</h3>
          {experiences.filter((item) => !city || item.citySlug === city).map((item) => (
            <p key={item.id}><Link href={`${localePath(locale, "/trip")}?${new URLSearchParams({ ...Object.fromEntries(keep), experience: item.id })}`}>{item.name[locale]}</Link></p>
          ))}
        </div>
      </div>

      <section className="glass mt-10 rounded-3xl p-6" aria-labelledby="review-title">
        <h2 id="review-title" className="serif text-3xl text-white">{d.trip.review}</h2>
        {lines.length === 0 ? <p className="mt-3">{d.common.empty}</p> : (
          <ul className="mt-4 space-y-2">
            {lines.map((line) => <li key={line.id} className="flex justify-between gap-4"><span>{line.label} · {d.demoBadge}</span><span>{money(line.amountEur)}</span></li>)}
          </ul>
        )}
        <p className="mt-4 text-xl text-white">{d.trip.estimate}: {money(total)}</p>
        <p className="text-sm text-faint">{d.simulatedRates}</p>
        <form action={submitRequest} className="mt-6 grid gap-3">
          <input type="hidden" name="locale" value={locale} />
          <input type="hidden" name="providerSlug" value={providerSlug} />
          <input type="hidden" name="treatmentSlug" value={treatment} />
          <input type="hidden" name="destinationSlug" value={city ?? ""} />
          <input type="hidden" name="currency" value={currency} />
          <label>{d.onboard.notes}
            <textarea name="note" maxLength={1000} className="mt-1 w-full rounded-xl bg-ink px-3 py-3" />
          </label>
          <button className="w-fit rounded-full bg-cyan px-5 py-3 font-semibold text-ink" type="submit" disabled={!providerSlug}>{d.trip.request}</button>
        </form>
      </section>
      <TrackView locale={locale} event="trip_started" treatmentSlug={treatment} providerSlug={providerSlug || undefined} />
    </section>
  );
}
