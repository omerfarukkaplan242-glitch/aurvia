import assert from "node:assert/strict";
import { describe, it } from "vitest";
import { calculateCommission, payableCommission, selectCommissionRule } from "./commission";
import { convertFromEur, convertToEur, SIMULATED_FX } from "./currency";
import { safeReturnPath } from "./safe-path";
import { buildTripSelection } from "./trip-selection";
import { serviceIntegrations } from "../services/integration-status";
import { matchProviders } from "./matching";
import { tripTotalEur } from "./trip";
import { canAccessAdmin, canChangeOwnRole, canManageProvider, canReadPatient } from "./authz";
import { contactSchema, onboardingSchema, signupSchema } from "./validation";
import { flights, hotels, providers, transfers, cars, experiences } from "../demo/inventory";
import { de, en, tr } from "../i18n/dictionaries";

describe("inventory", () => {
  it("meets the demo counts and never marks demo providers verified", () => {
    assert.equal(providers.length, 8);
    assert.equal(hotels.length, 8);
    assert.equal(flights.length, 8);
    assert.equal(transfers.length, 6);
    assert.equal(cars.length, 6);
    assert.ok(experiences.length >= 10);
    assert.equal(providers.every((item) => item.isDemo && item.verification === "unverified"), true);
  });
});

describe("matching", () => {
  it("explains non-medical overlap and skips other treatments", () => {
    const matches = matchProviders(
      [{
        slug: "demo-a",
        treatmentSlugs: ["hair-transplant"],
        citySlug: "istanbul",
        languages: ["en"],
        packagePricesEur: [1800],
        packageFeatures: [{ hotel: true, transfer: true }],
      }],
      { treatmentSlug: "hair-transplant", destinationSlug: "istanbul", language: "en", budgetMaxEur: 2000, wantsHotel: true },
    );
    assert.deepEqual(matches[0]?.reasons.sort(), ["budget", "destination", "language", "package", "treatment"].sort());
    assert.equal(matchProviders([{ slug: "x", treatmentSlugs: ["dental-treatment"], citySlug: "izmir", languages: ["tr"], packagePricesEur: [100], packageFeatures: [] }], { treatmentSlug: "hair-transplant" }).length, 0);
  });
});

describe("commission and currency", () => {
  it("prefers a provider-specific rule", () => {
    const rules = [
      { id: "g", service: "treatment" as const, mode: "percentage" as const, value: 8, providerId: null },
      { id: "s", service: "treatment" as const, mode: "percentage" as const, value: 6, providerId: "demo-marmara-care" },
    ];
    const rule = selectCommissionRule(rules, "treatment", "demo-marmara-care");
    assert.equal(calculateCommission(1000, rule), 60);
    assert.equal(calculateCommission(1000, selectCommissionRule(rules, "treatment", "other")), 80);
  });

  it("converts simulated EUR rates without claiming they are live", () => {
    assert.equal(SIMULATED_FX.simulated, true);
    assert.equal(convertFromEur(100, "USD"), 108);
    assert.equal(convertFromEur(10, "TRY"), 472);
    assert.equal(convertToEur(108, "USD"), 100);
  });

  it("does not pay commission on an inquiry, a simulation, a refund, or a duplicate event", () => {
    const rule = { id: "g", service: "hotel" as const, mode: "percentage" as const, value: 10, providerId: null };
    assert.equal(payableCommission({ amountEur: 500, rule, event: "inquiry" }), 0);
    assert.equal(payableCommission({ amountEur: 500, rule, event: "simulated" }), 0);
    assert.equal(payableCommission({ amountEur: 500, rule, event: "refunded" }), 0);
    assert.equal(payableCommission({ amountEur: 500, rule, event: "cancelled" }), 0);
    assert.equal(payableCommission({ amountEur: 500, rule, event: "confirmed", alreadyRecorded: true }), 0);
    assert.equal(payableCommission({ amountEur: 500, rule, event: "confirmed" }), 50);
  });
});

describe("trip and authz", () => {
  it("keeps return paths inside the active locale", () => {
    assert.equal(safeReturnPath("en", "/en/trip?provider=demo", "/en"), "/en/trip?provider=demo");
    assert.equal(safeReturnPath("en", "https://evil.example", "/en/journey"), "/en/journey");
    assert.equal(safeReturnPath("en", "/de/trip", "/en/journey"), "/en/journey");
  });

  it("prices a simulated trip from catalog ids and never marks it live", () => {
    const selection = buildTripSelection({
      treatmentSlug: "hair-transplant",
      providerSlug: providers[0]!.slug,
      flightId: flights[0]!.id,
      hotelId: hotels[0]!.id,
      nights: 2,
      locale: "en",
    });
    assert.equal(selection.simulated, true);
    assert.equal(selection.commercialStatus, "estimate");
    assert.equal(selection.lines.every((line) => line.simulated), true);
    assert.equal(selection.totalEur, selection.lines.reduce((sum, line) => sum + line.amountEur, 0));
    assert.equal(serviceIntegrations.payment, "SIMULATION");
    assert.equal(serviceIntegrations.flight, "SIMULATION");
  });

  it("sums only finite lines", () => {
    assert.equal(tripTotalEur([{ kind: "flight", id: "a", label: "a", amountEur: 100, simulated: true }, { kind: "hotel", id: "b", label: "b", amountEur: Number.NaN, simulated: true }]), 100);
  });

  it("blocks role changes and cross-provider access", () => {
    assert.equal(canChangeOwnRole("admin", "patient"), false);
    assert.equal(canAccessAdmin("patient"), false);
    assert.equal(canManageProvider({ role: "provider", providerIds: ["a"] }, "b"), false);
    assert.equal(canReadPatient({ userId: "u", role: "patient", relatedPatientIds: [] }, "other"), false);
  });
});

describe("forms", () => {
  it("accepts onboarding and rejects medical-length notes and honeypots", () => {
    assert.equal(signupSchema.safeParse({ fullName: "Ada Lovelace", email: "ada@example.com", password: "longpassword", locale: "en" }).success, true);
    assert.equal(onboardingSchema.safeParse({
      country: "Germany", language: "de", currency: "EUR", treatmentSlug: "hair-transplant", destinationSlug: "istanbul",
      travelWindow: "2026-11", budgetMax: 3000, travelers: 2, hotelPreference: "", flightPreference: "", transferPreference: "", notes: "window seat",
    }).success, true);
    assert.equal(contactSchema.safeParse({ name: "Ada", email: "ada@example.com", message: "Hello there from Berlin", locale: "en", company: "spam" }).success, false);
  });
});

describe("dictionaries", () => {
  it("keeps the required homepage promise in English", () => {
    assert.equal(en.hero.title, "One platform for your complete medical journey to Türkiye.");
    assert.equal(typeof de.hero.title, "string");
    assert.equal(typeof tr.hero.title, "string");
  });
});
