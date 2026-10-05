import { z } from "zod";
import { CURRENCIES } from "./currency";
import { LOCALES } from "../i18n/config";

const currency = z.enum(CURRENCIES);
const locale = z.enum(LOCALES);

export const signupSchema = z.object({
  fullName: z.string().trim().min(2).max(80),
  email: z.email().max(160),
  password: z.string().min(8).max(72),
  locale,
});

export const loginSchema = z.object({
  email: z.email().max(160),
  password: z.string().min(8).max(72),
});

export const resetSchema = z.object({
  email: z.email().max(160),
  locale,
});

export const onboardingSchema = z.object({
  country: z.string().trim().min(2).max(80),
  language: locale,
  currency,
  treatmentSlug: z.string().trim().min(2).max(80),
  destinationSlug: z.string().trim().min(2).max(80),
  travelWindow: z.string().trim().min(2).max(80),
  budgetMax: z.coerce.number().int().min(0).max(100000),
  travelers: z.coerce.number().int().min(1).max(12),
  hotelPreference: z.string().trim().max(80).optional().default(""),
  flightPreference: z.string().trim().max(80).optional().default(""),
  transferPreference: z.string().trim().max(80).optional().default(""),
  notes: z.string().trim().max(1000).optional().default(""),
});

export const requestSchema = z.object({
  providerSlug: z.string().trim().min(2).max(80),
  treatmentSlug: z.string().trim().min(2).max(80),
  destinationSlug: z.string().trim().max(80).optional().default(""),
  budgetMax: z.coerce.number().int().min(0).max(100000).optional(),
  currency,
  language: locale,
  note: z.string().trim().max(1000).optional().default(""),
});

export const messageSchema = z.object({
  conversationId: z.uuid(),
  body: z.string().trim().min(1).max(4000),
});

export const contactSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.email().max(160),
  message: z.string().trim().min(10).max(2000),
  locale,
  company: z.string().max(0).optional().default(""),
});

export const analyticsSchema = z.object({
  event: z.enum([
    "landing_view",
    "treatment_view",
    "provider_view",
    "search_started",
    "provider_selected",
    "comparison_started",
    "trip_started",
    "flight_selected",
    "hotel_selected",
    "transfer_selected",
    "trip_completed",
    "lead_submitted",
    "signup",
    "login",
  ]),
  path: z.string().trim().min(1).max(180),
  locale,
  treatmentSlug: z.string().trim().max(80).optional(),
  providerSlug: z.string().trim().max(80).optional(),
});

export const packagePriceSchema = z.object({
  packageId: z.uuid(),
  priceEur: z.coerce.number().int().min(0).max(100000),
});

export const commissionRuleSchema = z.object({
  id: z.uuid().optional(),
  service: z.enum(["treatment", "hotel", "transfer", "car", "esim", "insurance", "experience"]),
  mode: z.enum(["percentage", "fixed"]),
  value: z.coerce.number().min(0).max(100000),
  providerId: z.uuid().nullable().optional(),
});
