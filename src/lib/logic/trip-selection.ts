import {
  cars,
  esims,
  experiences,
  flights,
  hotels,
  insurancePlans,
  packages,
  transfers,
} from "../demo/inventory";
import type { Locale } from "../i18n/config";
import { tripTotalEur, type TripLine } from "./trip";

export type StoredSelection = {
  simulated: true;
  commercialStatus: "estimate";
  nights: number;
  totalEur: number;
  lines: TripLine[];
};

export function buildTripSelection(input: {
  treatmentSlug: string;
  providerSlug: string;
  flightId?: string;
  hotelId?: string;
  transferId?: string;
  carId?: string;
  esimId?: string;
  insuranceId?: string;
  experienceId?: string;
  nights: number;
  locale: Locale;
}): StoredSelection {
  const nights = Math.min(30, Math.max(1, Math.floor(input.nights) || 1));
  const lines: TripLine[] = [];
  const offer = packages.find((item) => item.providerSlug === input.providerSlug && item.treatmentSlug === input.treatmentSlug);
  if (offer) lines.push({ kind: "treatment", id: offer.slug, label: offer.title[input.locale], amountEur: offer.priceEur, simulated: true });
  const flight = flights.find((item) => item.id === input.flightId);
  if (flight) lines.push({ kind: "flight", id: flight.id, label: `${flight.airline} ${flight.origin}-${flight.destination}`, amountEur: flight.priceEur, simulated: true });
  const hotel = hotels.find((item) => item.id === input.hotelId);
  if (hotel) lines.push({ kind: "hotel", id: hotel.id, label: hotel.name, amountEur: hotel.pricePerNightEur * nights, simulated: true });
  const transfer = transfers.find((item) => item.id === input.transferId);
  if (transfer) lines.push({ kind: "transfer", id: transfer.id, label: transfer.vehicle, amountEur: transfer.priceEur, simulated: true });
  const car = cars.find((item) => item.id === input.carId);
  if (car) lines.push({ kind: "car", id: car.id, label: car.name, amountEur: car.pricePerDayEur * nights, simulated: true });
  const esim = esims.find((item) => item.id === input.esimId);
  if (esim) lines.push({ kind: "esim", id: esim.id, label: esim.name, amountEur: esim.priceEur, simulated: true });
  const insurance = insurancePlans.find((item) => item.id === input.insuranceId);
  if (insurance) lines.push({ kind: "insurance", id: insurance.id, label: insurance.name[input.locale], amountEur: insurance.priceEur, simulated: true });
  const experience = experiences.find((item) => item.id === input.experienceId);
  if (experience) lines.push({ kind: "experience", id: experience.id, label: experience.name[input.locale], amountEur: experience.priceEur, simulated: true });
  return { simulated: true, commercialStatus: "estimate", nights, totalEur: tripTotalEur(lines), lines };
}
