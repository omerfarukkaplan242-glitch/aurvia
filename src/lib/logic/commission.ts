export type CommissionMode = "percentage" | "fixed";
export type ServiceKind = "treatment" | "hotel" | "transfer" | "car" | "esim" | "insurance" | "experience";

export type CommissionRule = {
  id: string;
  service: ServiceKind;
  mode: CommissionMode;
  /** Percentage points, or a fixed amount in EUR. */
  value: number;
  providerId: string | null;
};

export function selectCommissionRule(
  rules: CommissionRule[],
  service: ServiceKind,
  providerId?: string | null,
): CommissionRule | null {
  if (providerId) {
    const specific = rules.find((rule) => rule.service === service && rule.providerId === providerId);
    if (specific) return specific;
  }
  return rules.find((rule) => rule.service === service && rule.providerId === null) ?? null;
}

export function calculateCommission(amountEur: number, rule: CommissionRule | null): number {
  if (!rule || amountEur <= 0) return 0;
  if (rule.mode === "fixed") return Math.max(0, Math.round(rule.value));
  return Math.max(0, Math.round((amountEur * rule.value) / 100));
}
