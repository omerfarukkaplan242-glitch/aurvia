"use client";

import { setCurrency } from "@/lib/actions";
import { CURRENCIES, type Currency } from "@/lib/logic/currency";
import type { Locale } from "@/lib/i18n/config";

export function CurrencyForm({
  locale,
  currency,
  label,
  save,
}: {
  locale: Locale;
  currency: Currency;
  label: string;
  save: string;
}) {
  return (
    <form
      action={setCurrency}
      className="flex items-center gap-2"
      onSubmit={(event) => {
        const field = event.currentTarget.elements.namedItem("returnTo");
        if (field instanceof HTMLInputElement) field.value = window.location.pathname + window.location.search;
      }}
    >
      <label className="sr-only" htmlFor="currency">{label}</label>
      <select
        id="currency"
        name="currency"
        defaultValue={currency}
        className="rounded-full bg-midnight px-3 py-2"
        onChange={(event) => event.currentTarget.form?.requestSubmit()}
      >
        {CURRENCIES.map((item) => <option key={item}>{item}</option>)}
      </select>
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="returnTo" defaultValue={`/${locale}`} />
      <button className="rounded-full border border-line px-3 py-2" type="submit">{save}</button>
    </form>
  );
}
