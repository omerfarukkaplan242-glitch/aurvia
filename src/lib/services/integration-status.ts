export const INTEGRATION_STATUSES = ["SIMULATION", "CONFIGURATION_REQUIRED", "SANDBOX", "LIVE"] as const;
export type IntegrationStatus = (typeof INTEGRATION_STATUSES)[number];

/** No live supplier is connected. Do not present these as bookings or revenue. */
export const serviceIntegrations = {
  flight: "SIMULATION",
  hotel: "SIMULATION",
  transfer: "SIMULATION",
  car: "SIMULATION",
  esim: "SIMULATION",
  insurance: "SIMULATION",
  experience: "SIMULATION",
  payment: "SIMULATION",
  fx: "SIMULATION",
} as const satisfies Record<string, IntegrationStatus>;
