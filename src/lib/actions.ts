"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { isCurrency } from "./logic/currency";
import { isLocale, localePath, type Locale } from "./i18n/config";
import { safeReturnPath } from "./logic/safe-path";
import { buildTripSelection } from "./logic/trip-selection";
import {
  contactSchema,
  loginSchema,
  onboardingSchema,
  packagePriceSchema,
  requestSchema,
  resetSchema,
  signupSchema,
  messageSchema,
  commissionRuleSchema,
} from "./logic/validation";
import { createClient } from "./supabase/server";
import { publicEnv } from "./supabase/env";
import { providers } from "./demo/inventory";

function localeFrom(formData: FormData) {
  const value = String(formData.get("locale") ?? "en");
  return isLocale(value) ? value : "en";
}

export async function setCurrency(formData: FormData) {
  const currency = String(formData.get("currency") ?? "EUR");
  const locale = localeFrom(formData);
  if (!isCurrency(currency)) return;
  const jar = await cookies();
  jar.set("aurvia_currency", currency, { path: "/", sameSite: "lax", maxAge: 60 * 60 * 24 * 365 });
  redirect(safeReturnPath(locale, formData.get("returnTo"), localePath(locale)));
}

export async function signup(formData: FormData) {
  const locale = localeFrom(formData);
  const parsed = signupSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    password: formData.get("password"),
    locale,
  });
  if (!parsed.success) redirect(localePath(locale, "/signup?error=invalid"));
  const supabase = await createClient();
  const env = publicEnv();
  if (!supabase || !env) redirect(localePath(locale, "/signup?error=config"));
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { full_name: parsed.data.fullName },
      emailRedirectTo: `${env.siteUrl}/auth/callback?next=${localePath(locale, "/onboarding")}`,
    },
  });
  if (error) redirect(localePath(locale, "/signup?error=auth"));
  redirect(localePath(locale, "/signup?sent=1"));
}

export async function login(formData: FormData) {
  const locale = localeFrom(formData);
  const parsed = loginSchema.safeParse({ email: formData.get("email"), password: formData.get("password") });
  if (!parsed.success) redirect(localePath(locale, "/login?error=invalid"));
  const supabase = await createClient();
  if (!supabase) redirect(localePath(locale, "/login?error=config"));
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) redirect(localePath(locale, "/login?error=auth"));
  redirect(safeReturnPath(locale, formData.get("next"), localePath(locale, "/journey")));
}

export async function logout(formData: FormData) {
  const locale = localeFrom(formData);
  const supabase = await createClient();
  if (supabase) await supabase.auth.signOut();
  redirect(localePath(locale));
}

export async function resetPassword(formData: FormData) {
  const locale = localeFrom(formData);
  const parsed = resetSchema.safeParse({ email: formData.get("email"), locale });
  if (!parsed.success) redirect(localePath(locale, "/reset?error=invalid"));
  const supabase = await createClient();
  const env = publicEnv();
  if (!supabase || !env) redirect(localePath(locale, "/reset?error=config"));
  await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${env.siteUrl}/auth/callback?next=${localePath(locale, "/login")}`,
  });
  redirect(localePath(locale, "/reset?sent=1"));
}

export async function saveOnboarding(formData: FormData) {
  const locale = localeFrom(formData);
  const parsed = onboardingSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) redirect(localePath(locale, "/onboarding?error=invalid"));
  const supabase = await createClient();
  if (!supabase) redirect(localePath(locale, "/onboarding?error=config"));
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(localePath(locale, "/login"));
  const { error } = await supabase.from("patient_preferences").upsert({
    user_id: user.id,
    treatment_slug: parsed.data.treatmentSlug,
    destination_slug: parsed.data.destinationSlug,
    travel_window: parsed.data.travelWindow,
    budget_max: parsed.data.budgetMax,
    currency: parsed.data.currency,
    travelers: parsed.data.travelers,
    hotel_preference: parsed.data.hotelPreference,
    flight_preference: parsed.data.flightPreference,
    transfer_preference: parsed.data.transferPreference,
    notes: parsed.data.notes,
  });
  if (error) redirect(localePath(locale, "/onboarding?error=save"));
  await supabase.from("profiles").update({
    country: parsed.data.country,
    preferred_language: parsed.data.language,
    preferred_currency: parsed.data.currency,
  }).eq("id", user.id);
  redirect(localePath(locale, `/match?treatment=${parsed.data.treatmentSlug}&city=${parsed.data.destinationSlug}&budget=${parsed.data.budgetMax}&language=${parsed.data.language}`));
}

export async function submitRequest(formData: FormData) {
  const locale = localeFrom(formData);
  const parsed = requestSchema.safeParse({
    providerSlug: formData.get("providerSlug"),
    treatmentSlug: formData.get("treatmentSlug"),
    destinationSlug: formData.get("destinationSlug") ?? "",
    budgetMax: formData.get("budgetMax") || undefined,
    currency: formData.get("currency") ?? "EUR",
    language: locale,
    note: formData.get("note") ?? "",
  });
  if (!parsed.success) redirect(localePath(locale, "/trip?error=invalid"));
  const supabase = await createClient();
  if (!supabase) redirect(localePath(locale, "/trip?error=config"));
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    const resume = new URLSearchParams();
    for (const [key, field] of [
      ["treatment", "treatmentSlug"],
      ["provider", "providerSlug"],
      ["flight", "flightId"],
      ["hotel", "hotelId"],
      ["transfer", "transferId"],
      ["car", "carId"],
      ["esim", "esimId"],
      ["insurance", "insuranceId"],
      ["experience", "experienceId"],
      ["nights", "nights"],
    ] as const) {
      const value = String(formData.get(field) ?? "");
      if (value) resume.set(key, value);
    }
    const next = localePath(locale, `/trip${resume.size ? `?${resume}` : ""}`);
    redirect(localePath(locale, `/login?next=${encodeURIComponent(next)}`));
  }
  const { data: allowed } = await supabase.rpc("consume_rate_limit", { action: "submit_request", max_hits: 8, window_seconds: 3600 });
  if (allowed === false) redirect(localePath(locale, "/trip?error=rate"));
  const provider = providers.find((item) => item.slug === parsed.data.providerSlug);
  if (!provider) redirect(localePath(locale, "/trip?error=invalid"));
  const nights = Math.min(30, Math.max(1, Number(formData.get("nights") || 3)));
  const selection = buildTripSelection({
    treatmentSlug: parsed.data.treatmentSlug,
    providerSlug: provider.slug,
    flightId: String(formData.get("flightId") ?? ""),
    hotelId: String(formData.get("hotelId") ?? ""),
    transferId: String(formData.get("transferId") ?? ""),
    carId: String(formData.get("carId") ?? ""),
    esimId: String(formData.get("esimId") ?? ""),
    insuranceId: String(formData.get("insuranceId") ?? ""),
    experienceId: String(formData.get("experienceId") ?? ""),
    nights,
    locale: locale as Locale,
  });
  const { data: providerRow } = await supabase.from("providers").select("id").eq("slug", provider.slug).maybeSingle();
  if (providerRow?.id) {
    const since = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    const { data: existing } = await supabase.from("requests").select("id").eq("patient_id", user.id).eq("provider_id", providerRow.id).eq("treatment_slug", parsed.data.treatmentSlug).gte("created_at", since).limit(1);
    if (existing && existing.length > 0) redirect(localePath(locale, "/journey?sent=1"));
  }
  const { data: request, error } = await supabase.from("requests").insert({
    patient_id: user.id,
    provider_id: providerRow?.id ?? null,
    treatment_slug: parsed.data.treatmentSlug,
    destination_slug: parsed.data.destinationSlug,
    budget_max: parsed.data.budgetMax ?? null,
    currency: parsed.data.currency,
    language: parsed.data.language,
    note: parsed.data.note,
    status: "submitted",
    selection,
  }).select("id").single();
  if (error || !request) redirect(localePath(locale, "/trip?error=save"));
  const { data: journey, error: journeyError } = await supabase.from("journeys").insert({
    patient_id: user.id,
    request_id: request.id,
    provider_id: providerRow?.id ?? null,
    stage: "consultation",
    title: "My journey",
  }).select("id").single();
  if (journeyError || !journey) redirect(localePath(locale, "/trip?error=save"));
  await supabase.from("trip_drafts").upsert({
    patient_id: user.id,
    payload: selection,
    currency: parsed.data.currency,
  });
  if (selection.lines.length > 0) {
    await supabase.from("bookings").insert(selection.lines.map((line) => ({
      journey_id: journey.id,
      patient_id: user.id,
      kind: line.kind,
      reference: line.id,
      amount_eur: line.amountEur,
      status: "requested",
      simulated: true,
    })));
  }
  redirect(localePath(locale, "/journey?sent=1"));
}

export async function sendMessage(formData: FormData) {
  const locale = localeFrom(formData);
  const parsed = messageSchema.safeParse({
    conversationId: formData.get("conversationId"),
    body: formData.get("body"),
  });
  if (!parsed.success) redirect(localePath(locale, "/messages?error=invalid"));
  const supabase = await createClient();
  if (!supabase) redirect(localePath(locale, "/messages?error=config"));
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(localePath(locale, "/login"));
  const { data: allowed } = await supabase.rpc("consume_rate_limit", { action: "send_message", max_hits: 30, window_seconds: 600 });
  if (allowed === false) redirect(localePath(locale, "/messages?error=rate"));
  const { error } = await supabase.from("messages").insert({
    conversation_id: parsed.data.conversationId,
    sender_id: user.id,
    body: parsed.data.body,
  });
  if (error) redirect(localePath(locale, "/messages?error=save"));
  revalidatePath(localePath(locale, "/messages"));
  redirect(localePath(locale, "/messages"));
}

export async function sendContact(formData: FormData) {
  const locale = localeFrom(formData);
  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
    locale,
    company: formData.get("company") ?? "",
  });
  if (!parsed.success) redirect(localePath(locale, "/contact?error=invalid"));
  const supabase = await createClient();
  if (!supabase) redirect(localePath(locale, "/contact?error=config"));
  const { error } = await supabase.from("contact_messages").insert({
    name: parsed.data.name,
    email: parsed.data.email,
    message: parsed.data.message,
    locale,
  });
  if (error) redirect(localePath(locale, "/contact?error=save"));
  redirect(localePath(locale, "/contact?sent=1"));
}

export async function respondToRequest(formData: FormData) {
  const locale = localeFrom(formData);
  const id = String(formData.get("requestId") ?? "");
  const supabase = await createClient();
  if (!supabase) redirect(localePath(locale, "/provider?error=config"));
  const { error } = await supabase.from("requests").update({ status: "responded" }).eq("id", id);
  if (error) redirect(localePath(locale, "/provider?error=save"));
  redirect(localePath(locale, "/provider?sent=1"));
}

export async function updatePackagePrice(formData: FormData) {
  const locale = localeFrom(formData);
  const parsed = packagePriceSchema.safeParse({
    packageId: formData.get("packageId"),
    priceEur: formData.get("priceEur"),
  });
  if (!parsed.success) redirect(localePath(locale, "/provider?error=invalid"));
  const supabase = await createClient();
  if (!supabase) redirect(localePath(locale, "/provider?error=config"));
  const { error } = await supabase.from("packages").update({ price_eur: parsed.data.priceEur }).eq("id", parsed.data.packageId);
  if (error) redirect(localePath(locale, "/provider?error=save"));
  redirect(localePath(locale, "/provider?sent=1"));
}

export async function saveCommission(formData: FormData) {
  const locale = localeFrom(formData);
  const parsed = commissionRuleSchema.safeParse({
    service: formData.get("service"),
    mode: formData.get("mode"),
    value: formData.get("value"),
    providerId: formData.get("providerId") || null,
  });
  if (!parsed.success) redirect(localePath(locale, "/admin/commissions?error=invalid"));
  const supabase = await createClient();
  if (!supabase) redirect(localePath(locale, "/admin/commissions?error=config"));
  const { error } = await supabase.from("commission_rules").insert({
    service: parsed.data.service,
    mode: parsed.data.mode,
    value: parsed.data.value,
    provider_slug: formData.get("providerSlug") || null,
  });
  if (error) redirect(localePath(locale, "/admin/commissions?error=save"));
  redirect(localePath(locale, "/admin/commissions?sent=1"));
}

export async function advanceJourney(formData: FormData) {
  const locale = localeFrom(formData);
  const id = String(formData.get("journeyId") ?? "");
  const stage = String(formData.get("stage") ?? "");
  const supabase = await createClient();
  if (!supabase) redirect(localePath(locale, "/provider?error=config"));
  const { error } = await supabase.from("journeys").update({ stage }).eq("id", id);
  if (error) redirect(localePath(locale, "/provider?error=save"));
  redirect(localePath(locale, "/provider?sent=1"));
}
