"use client";

import { useEffect } from "react";
import type { Locale } from "@/lib/i18n/config";

export function TrackView({
  locale,
  event,
  treatmentSlug,
  providerSlug,
}: {
  locale: Locale;
  event: string;
  treatmentSlug?: string;
  providerSlug?: string;
}) {
  useEffect(() => {
    const payload = {
      event,
      path: window.location.pathname,
      locale,
      treatmentSlug,
      providerSlug,
    };
    void fetch("/api/analytics", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
  }, [event, locale, providerSlug, treatmentSlug]);
  return null;
}
