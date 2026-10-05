import {
  cars,
  esims,
  experiences,
  flights,
  hotels,
  insurancePlans,
  transfers,
  type DemoCar,
  type DemoEsim,
  type DemoExperience,
  type DemoFlight,
  type DemoHotel,
  type DemoInsurance,
  type DemoTransfer,
} from "../demo/inventory";

export type ProviderMode = "demo" | "live";

export type FlightQuery = { origin?: string; destination?: string; date?: string; passengers?: number };
export type HotelQuery = { citySlug?: string; nights?: number };
export type TransferQuery = { citySlug?: string; route?: DemoTransfer["route"] };
export type CarQuery = { citySlug?: string };
export type ExperienceQuery = { citySlug?: string };

export interface FlightProvider {
  readonly id: string;
  readonly mode: ProviderMode;
  search(query: FlightQuery): Promise<DemoFlight[]>;
}

export interface HotelProvider {
  readonly id: string;
  readonly mode: ProviderMode;
  search(query: HotelQuery): Promise<DemoHotel[]>;
}

export interface TransferProvider {
  readonly id: string;
  readonly mode: ProviderMode;
  search(query: TransferQuery): Promise<DemoTransfer[]>;
}

export interface CarRentalProvider {
  readonly id: string;
  readonly mode: ProviderMode;
  search(query: CarQuery): Promise<DemoCar[]>;
}

export interface EsimProvider {
  readonly id: string;
  readonly mode: ProviderMode;
  list(): Promise<DemoEsim[]>;
}

export interface InsuranceProvider {
  readonly id: string;
  readonly mode: ProviderMode;
  list(): Promise<DemoInsurance[]>;
}

export interface ExperienceProvider {
  readonly id: string;
  readonly mode: ProviderMode;
  search(query: ExperienceQuery): Promise<DemoExperience[]>;
}

export interface PaymentRequest {
  amountEur: number;
  currency: string;
  reference: string;
}

export interface PaymentResult {
  status: "simulated";
  reference: string;
  provider: "simulation";
}

export interface PaymentProvider {
  readonly id: string;
  readonly mode: ProviderMode;
  authorize(input: PaymentRequest): Promise<PaymentResult>;
}

class SimulationFlightProvider implements FlightProvider {
  readonly id = "simulation-flight";
  readonly mode = "demo" as const;
  async search(query: FlightQuery): Promise<DemoFlight[]> {
    return flights.filter((item) => {
      if (query.origin && item.origin !== query.origin.toUpperCase()) return false;
      if (query.destination && item.destination !== query.destination.toUpperCase()) return false;
      if (query.date && !item.departAt.startsWith(query.date)) return false;
      return true;
    });
  }
}

class SimulationHotelProvider implements HotelProvider {
  readonly id = "simulation-hotel";
  readonly mode = "demo" as const;
  async search(query: HotelQuery): Promise<DemoHotel[]> {
    return hotels.filter((item) => !query.citySlug || item.citySlug === query.citySlug);
  }
}

class SimulationTransferProvider implements TransferProvider {
  readonly id = "simulation-transfer";
  readonly mode = "demo" as const;
  async search(query: TransferQuery): Promise<DemoTransfer[]> {
    return transfers.filter((item) => {
      if (query.citySlug && item.citySlug !== query.citySlug) return false;
      if (query.route && item.route !== query.route) return false;
      return true;
    });
  }
}

class SimulationCarRentalProvider implements CarRentalProvider {
  readonly id = "simulation-car";
  readonly mode = "demo" as const;
  async search(query: CarQuery): Promise<DemoCar[]> {
    return cars.filter((item) => !query.citySlug || item.citySlug === query.citySlug);
  }
}

class SimulationEsimProvider implements EsimProvider {
  readonly id = "simulation-esim";
  readonly mode = "demo" as const;
  async list(): Promise<DemoEsim[]> {
    return esims;
  }
}

class SimulationInsuranceProvider implements InsuranceProvider {
  readonly id = "simulation-insurance";
  readonly mode = "demo" as const;
  async list(): Promise<DemoInsurance[]> {
    return insurancePlans;
  }
}

class SimulationExperienceProvider implements ExperienceProvider {
  readonly id = "simulation-experience";
  readonly mode = "demo" as const;
  async search(query: ExperienceQuery): Promise<DemoExperience[]> {
    return experiences.filter((item) => !query.citySlug || item.citySlug === query.citySlug);
  }
}

class SimulationPaymentProvider implements PaymentProvider {
  readonly id = "simulation-payment";
  readonly mode = "demo" as const;
  async authorize(input: PaymentRequest): Promise<PaymentResult> {
    if (!Number.isFinite(input.amountEur) || input.amountEur < 0) {
      throw new Error("invalid_amount");
    }
    return { status: "simulated", reference: input.reference, provider: "simulation" };
  }
}

export const flightProvider: FlightProvider = new SimulationFlightProvider();
export const hotelProvider: HotelProvider = new SimulationHotelProvider();
export const transferProvider: TransferProvider = new SimulationTransferProvider();
export const carRentalProvider: CarRentalProvider = new SimulationCarRentalProvider();
export const esimProvider: EsimProvider = new SimulationEsimProvider();
export const insuranceProvider: InsuranceProvider = new SimulationInsuranceProvider();
export const experienceProvider: ExperienceProvider = new SimulationExperienceProvider();
export const paymentProvider: PaymentProvider = new SimulationPaymentProvider();
