export const CURRENCIES = ["EUR", "USD", "GBP", "TRY"] as const;
export type Currency = (typeof CURRENCIES)[number];

export type FxTable = {
  base: "EUR";
  simulated: true;
  asOf: string;
  rates: Record<Currency, number>;
};

export const SIMULATED_FX: FxTable = {
  base: "EUR",
  simulated: true,
  asOf: "2026-10-01",
  rates: { EUR: 1, USD: 1.08, GBP: 0.85, TRY: 47.2 },
};

export function isCurrency(value: string): value is Currency {
  return (CURRENCIES as readonly string[]).includes(value);
}

export function convertFromEur(amountEur: number, currency: Currency, table: FxTable = SIMULATED_FX): number {
  if (!Number.isFinite(amountEur)) return 0;
  const rate = table.rates[currency];
  return Math.round(amountEur * rate);
}

export function convertToEur(amount: number, currency: Currency, table: FxTable = SIMULATED_FX): number {
  if (!Number.isFinite(amount) || amount <= 0) return 0;
  const rate = table.rates[currency];
  if (!rate) return 0;
  return Math.round(amount / rate);
}

export function formatMoney(amount: number, currency: Currency, locale: string): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "TRY" ? 0 : 0,
  }).format(amount);
}
