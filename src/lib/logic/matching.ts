export type MatchReason = "treatment" | "destination" | "budget" | "language" | "package";

export type MatchableProvider = {
  slug: string;
  treatmentSlugs: string[];
  citySlug: string;
  languages: string[];
  packagePricesEur: number[];
  packageFeatures: { hotel: boolean; transfer: boolean }[];
};

export type MatchInput = {
  treatmentSlug: string;
  destinationSlug?: string;
  budgetMaxEur?: number;
  language?: string;
  wantsHotel?: boolean;
  wantsTransfer?: boolean;
};

export type ProviderMatch = {
  slug: string;
  reasons: MatchReason[];
};

/**
 * Non-medical matching. A provider is included only when the requested
 * treatment is offered. Other reasons explain preference overlap.
 * The result is not a diagnosis, ranking, or clinical recommendation.
 */
export function matchProviders(providers: MatchableProvider[], input: MatchInput): ProviderMatch[] {
  const matches: ProviderMatch[] = [];
  for (const provider of providers) {
    if (!input.treatmentSlug || !provider.treatmentSlugs.includes(input.treatmentSlug)) continue;
    const reasons: MatchReason[] = ["treatment"];
    if (input.destinationSlug && provider.citySlug === input.destinationSlug) reasons.push("destination");
    if (input.language && provider.languages.includes(input.language)) reasons.push("language");
    if (
      typeof input.budgetMaxEur === "number" &&
      provider.packagePricesEur.some((price) => price <= input.budgetMaxEur!)
    ) {
      reasons.push("budget");
    }
    const featureHit = provider.packageFeatures.some((feature) => {
      const hotelOk = input.wantsHotel ? feature.hotel : true;
      const transferOk = input.wantsTransfer ? feature.transfer : true;
      return hotelOk && transferOk && (input.wantsHotel || input.wantsTransfer);
    });
    if (featureHit) reasons.push("package");
    matches.push({ slug: provider.slug, reasons });
  }
  return matches.sort((a, b) => b.reasons.length - a.reasons.length || a.slug.localeCompare(b.slug));
}
