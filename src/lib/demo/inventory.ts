import type { Locale } from "../i18n/config";

export type Copy = Record<Locale, string>;

const L = (en: string, de: string, tr: string): Copy => ({ en, de, tr });

export type TreatmentStatus = "open" | "preview";

export type Treatment = {
  slug: string;
  category: string;
  status: TreatmentStatus;
  name: Copy;
  summary: Copy;
  process: Copy;
  journey: Copy;
  preparation: Copy;
  recovery: Copy;
  destination: Copy;
};

export type Destination = {
  slug: string;
  name: Copy;
  summary: Copy;
};

export type DemoProvider = {
  slug: string;
  name: string;
  citySlug: string;
  isDemo: true;
  verification: "unverified";
  languages: Locale[];
  treatmentSlugs: string[];
  summary: Copy;
};

export type DemoPackage = {
  slug: string;
  providerSlug: string;
  treatmentSlug: string;
  title: Copy;
  summary: Copy;
  priceEur: number;
  nights: number;
  includesHotel: boolean;
  includesTransfer: boolean;
  includesConsultation: boolean;
  isDemo: true;
};

export type DemoFlight = {
  id: string;
  isDemo: true;
  origin: string;
  destination: string;
  airline: string;
  departAt: string;
  arriveAt: string;
  durationMinutes: number;
  priceEur: number;
  baggage: string;
};

export type DemoHotel = {
  id: string;
  isDemo: true;
  name: string;
  citySlug: string;
  rating: number;
  roomType: string;
  pricePerNightEur: number;
  amenities: string[];
  cancellation: Copy;
};

export type DemoTransfer = {
  id: string;
  isDemo: true;
  citySlug: string;
  route: "airport_hotel" | "hotel_clinic" | "clinic_hotel" | "hotel_airport";
  vehicle: string;
  passengers: number;
  durationMinutes: number;
  priceEur: number;
};

export type DemoCar = {
  id: string;
  isDemo: true;
  name: string;
  citySlug: string;
  transmission: "automatic" | "manual";
  seats: number;
  luggage: number;
  pricePerDayEur: number;
};

export type DemoEsim = {
  id: string;
  isDemo: true;
  name: string;
  dataGb: number;
  days: number;
  priceEur: number;
  destination: "TR";
};

export type DemoInsurance = {
  id: string;
  isDemo: true;
  name: Copy;
  summary: Copy;
  days: number;
  priceEur: number;
};

export type DemoExperience = {
  id: string;
  isDemo: true;
  citySlug: string;
  name: Copy;
  summary: Copy;
  priceEur: number;
  hours: number;
};

export const treatments: Treatment[] = [
  {
    slug: "hair-transplant",
    category: "hair",
    status: "open",
    name: L("Hair transplant", "Haartransplantation", "Saç ekimi"),
    summary: L(
      "A surgical procedure performed by qualified clinicians. AURVIA helps you organize the trip around a consultation, not the clinical plan.",
      "Ein chirurgischer Eingriff durch qualifizierte Fachpersonen. AURVIA organisiert die Reise um ein Gespräch, nicht den klinischen Plan.",
      "Nitelikli klinisyenlerce yapılan cerrahi bir işlemdir. AURVIA, klinik planı değil görüşme etrafındaki seyahati düzenler.",
    ),
    process: L(
      "You choose a city and send an information request. A provider may reply with availability. Any clinical assessment happens with them, outside this product.",
      "Sie wählen eine Stadt und senden eine Informationsanfrage. Ein Anbieter kann mit Verfügbarkeit antworten. Die klinische Beurteilung erfolgt bei ihm, außerhalb dieses Produkts.",
      "Bir şehir seçer ve bilgi talebi gönderirsiniz. Sağlayıcı uygunlukla yanıtlayabilir. Klinik değerlendirme bu ürünün dışında, onlarla yapılır.",
    ),
    journey: L(
      "Request, provider reply, travel plan, arrival, appointment window, rest days, and return. Timing varies and is not promised here.",
      "Anfrage, Antwort, Reiseplan, Ankunft, Terminzeitfenster, Ruhetage und Rückreise. Die Dauer variiert und wird hier nicht versprochen.",
      "Talep, yanıt, seyahat planı, varış, randevu aralığı, dinlenme günleri ve dönüş. Süre değişir ve burada vaat edilmez.",
    ),
    preparation: L(
      "Carry your own travel documents. Share clinical history only with the clinician you choose, not in public notes on AURVIA.",
      "Führen Sie Ihre Reisedokumente mit. Teilen Sie die Krankengeschichte nur mit der gewählten Fachperson, nicht in öffentlichen Notizen.",
      "Seyahat belgelerinizi yanınızda bulundurun. Tıbbi öykünüzü yalnızca seçtiğiniz klinisyenle paylaşın, AURVIA notlarında değil.",
    ),
    recovery: L(
      "People often plan several quieter days after a procedure. Exact limits on work, exercise, and flying are set by the treating clinician.",
      "Viele planen nach einem Eingriff mehrere ruhigere Tage. Grenzen für Arbeit, Sport und Fliegen setzt die behandelnde Fachperson.",
      "Birçok kişi işlemden sonra birkaç sakin gün planlar. İş, egzersiz ve uçuş sınırlarını tedavi eden klinisyen belirler.",
    ),
    destination: L(
      "Demo providers are placed in Istanbul, Izmir, and Cappadocia so you can compare cities. They are not real clinics.",
      "Demo-Anbieter liegen in Istanbul, Izmir und Kappadokien, damit Sie Städte vergleichen können. Es sind keine echten Kliniken.",
      "Demo sağlayıcılar şehir karşılaştırması için İstanbul, İzmir ve Kapadokya’dadır. Gerçek klinik değildirler.",
    ),
  },
  {
    slug: "dental-treatment",
    category: "dental",
    status: "open",
    name: L("Dental treatment", "Zahnbehandlung", "Diş tedavisi"),
    summary: L(
      "Dental care covers many different procedures. This page explains how a trip can be organized. It does not recommend a treatment.",
      "Zahnbehandlungen umfassen viele verschiedene Eingriffe. Diese Seite erklärt die Reiseorganisation. Sie empfiehlt keine Behandlung.",
      "Diş tedavisi birçok farklı işlemi kapsar. Bu sayfa seyahatin nasıl düzenleneceğini anlatır. Bir tedavi önermez.",
    ),
    process: L(
      "Filter demo studios by city and language, compare package outlines, and request information. A dentist must confirm what is appropriate.",
      "Filtern Sie Demo-Praxen nach Stadt und Sprache, vergleichen Sie Paketabriss und fragen Sie Informationen an. Eine Zahnärztin oder ein Zahnarzt muss bestätigen, was passend ist.",
      "Demo stüdyoları şehir ve dile göre süzün, paket taslaklarını karşılaştırın ve bilgi isteyin. Ne uygunsa bir diş hekimi onaylamalıdır.",
    ),
    journey: L(
      "Some visits need more than one appointment. The builder lets you keep hotel nights and transfers next to the request. It does not book a clinic.",
      "Manche Besuche brauchen mehr als einen Termin. Der Planer hält Hotelnächte und Transfers neben der Anfrage. Er bucht keine Klinik.",
      "Bazı ziyaretler birden fazla randevu ister. Planlayıcı otel gecelerini ve transferleri talebin yanında tutar. Klinik ayırtmaz.",
    ),
    preparation: L(
      "Bring prior dental records only if you decide to share them privately with a provider. Do not upload them to public fields.",
      "Frühere Unterlagen nur privat teilen, wenn Sie das möchten. Laden Sie sie nicht in öffentliche Felder.",
      "Önceki diş kayıtlarını yalnızca özel olarak paylaşmaya karar verirseniz götürün. Herkese açık alanlara yüklemeyin.",
    ),
    recovery: L(
      "Comfort, diet, and travel timing depend on the procedure a dentist actually plans. This preview does not estimate pain or results.",
      "Komfort, Ernährung und Reisezeit hängen vom tatsächlich geplanten Eingriff ab. Diese Vorschau schätzt weder Schmerz noch Ergebnisse.",
      "Konfor, beslenme ve seyahat zamanı diş hekiminin planladığı işleme bağlıdır. Bu önizleme ağrı veya sonuç tahmin etmez.",
    ),
    destination: L(
      "Demo dental studios are in Istanbul, Antalya, and Izmir.",
      "Demo-Zahnstudios liegen in Istanbul, Antalya und Izmir.",
      "Demo diş stüdyoları İstanbul, Antalya ve İzmir’dedir.",
    ),
  },
  ...["aesthetic-procedures", "eye-treatments", "weight-management", "cosmetic-surgery"].map((slug) => ({
    slug,
    category: slug,
    status: "preview" as const,
    name: L(
      slug === "aesthetic-procedures" ? "Aesthetic procedures" : slug === "eye-treatments" ? "Eye treatments" : slug === "weight-management" ? "Weight management" : "Cosmetic surgery",
      slug === "aesthetic-procedures" ? "Ästhetische Verfahren" : slug === "eye-treatments" ? "Augenbehandlungen" : slug === "weight-management" ? "Gewichtsmanagement" : "Kosmetische Chirurgie",
      slug === "aesthetic-procedures" ? "Estetik işlemler" : slug === "eye-treatments" ? "Göz tedavileri" : slug === "weight-management" ? "Kilo yönetimi" : "Kozmetik cerrahi",
    ),
    summary: L(
      "This category is reserved for a later release. No providers are listed.",
      "Diese Kategorie ist für eine spätere Version reserviert. Es sind keine Anbieter gelistet.",
      "Bu kategori sonraki bir sürüm için ayrılmıştır. Sağlayıcı listelenmez.",
    ),
    process: L("Not open for requests.", "Nicht für Anfragen geöffnet.", "Taleplere açık değil."),
    journey: L("No sample journey is published.", "Keine Beispielreise ist veröffentlicht.", "Örnek yolculuk yayımlanmaz."),
    preparation: L("No guidance is offered yet.", "Noch keine Hinweise.", "Henüz yönlendirme yok."),
    recovery: L("No recovery claims are made.", "Keine Angaben zur Erholung.", "İyileşme iddiası yoktur."),
    destination: L("No destination pairing yet.", "Noch keine Reisezielzuordnung.", "Henüz destinasyon eşlemesi yok."),
  })),
];

export const destinations: Destination[] = [
  ["istanbul", "Istanbul", "Istanbul", "İstanbul", "A large hub with the main international airport and demo providers for hair and dental."],
  ["ankara", "Ankara", "Ankara", "Ankara", "The capital, included so trip plans can start or connect inland."],
  ["izmir", "Izmir", "Izmir", "İzmir", "An Aegean city with demo hair and dental studios."],
  ["antalya", "Antalya", "Antalya", "Antalya", "A Mediterranean coast city with a demo dental studio and hotels."],
  ["nevsehir", "Cappadocia", "Kappadokien", "Kapadokya", "Nevşehir / Cappadocia, with a demo hair atelier and a stone-court hotel."],
  ["gaziantep", "Gaziantep", "Gaziantep", "Gaziantep", "Included for culinary demo experiences. No treatment provider is invented here."],
].map(([slug, en, de, tr, summary]) => ({
  slug,
  name: L(en, de, tr),
  summary: L(summary, summary, summary),
}));

export const providers: DemoProvider[] = [
  { slug: "demo-northlight-hair", name: "DEMO Northlight Hair Atelier", citySlug: "istanbul", isDemo: true, verification: "unverified", languages: ["en", "tr", "de"], treatmentSlugs: ["hair-transplant"], summary: L("Fictional Istanbul atelier for the hair-transplant journey.", "Fiktives Istanbuler Atelier für die Haar-Reise.", "Saç yolculuğu için kurgusal İstanbul atölyesi.") },
  { slug: "demo-bosphorus-crown", name: "DEMO Bosphorus Crown Studio", citySlug: "istanbul", isDemo: true, verification: "unverified", languages: ["en", "tr"], treatmentSlugs: ["hair-transplant"], summary: L("Fictional studio. Hotel and transfer coordination are included in the demo package.", "Fiktives Studio. Hotel- und Transferkoordination sind im Demo-Paket.", "Kurgusal stüdyo. Demo pakette otel ve transfer koordinasyonu vardır.") },
  { slug: "demo-aegean-strand", name: "DEMO Aegean Strand Studio", citySlug: "izmir", isDemo: true, verification: "unverified", languages: ["en", "de"], treatmentSlugs: ["hair-transplant"], summary: L("Fictional Izmir studio used to compare a coastal city.", "Fiktives Izmir-Studio für den Vergleich einer Küstenstadt.", "Kıyı şehri karşılaştırması için kurgusal İzmir stüdyosu.") },
  { slug: "demo-cappadocia-follicle", name: "DEMO Cappadocia Follicle House", citySlug: "nevsehir", isDemo: true, verification: "unverified", languages: ["en", "tr"], treatmentSlugs: ["hair-transplant"], summary: L("Fictional Cappadocia house. Not a licensed facility.", "Fiktives Haus in Kappadokien. Keine lizenzierte Einrichtung.", "Kurgusal Kapadokya evi. Lisanslı bir tesis değildir.") },
  { slug: "demo-golden-horn-smile", name: "DEMO Golden Horn Smile Room", citySlug: "istanbul", isDemo: true, verification: "unverified", languages: ["en", "tr", "de"], treatmentSlugs: ["dental-treatment"], summary: L("Fictional dental room in Istanbul.", "Fiktiver Zahnraum in Istanbul.", "İstanbul’da kurgusal diş odası.") },
  { slug: "demo-turquoise-enamel", name: "DEMO Turquoise Enamel Studio", citySlug: "antalya", isDemo: true, verification: "unverified", languages: ["en", "de", "tr"], treatmentSlugs: ["dental-treatment"], summary: L("Fictional Antalya studio for dental trip planning.", "Fiktives Antalya-Studio für die Zahnreise.", "Diş seyahati planı için kurgusal Antalya stüdyosu.") },
  { slug: "demo-levant-dental", name: "DEMO Levant Dental Atelier", citySlug: "izmir", isDemo: true, verification: "unverified", languages: ["en", "tr"], treatmentSlugs: ["dental-treatment"], summary: L("Fictional Izmir dental atelier with a demo hotel night option.", "Fiktives Izmir-Atelier mit Demo-Hotelnacht.", "Demo otel gecesi seçenekli kurgusal İzmir diş atölyesi.") },
  { slug: "demo-marmara-care", name: "DEMO Marmara Care Collective", citySlug: "istanbul", isDemo: true, verification: "unverified", languages: ["en", "tr", "de"], treatmentSlugs: ["hair-transplant", "dental-treatment"], summary: L("Fictional collective offering both open treatments in this preview.", "Fiktives Kollektiv mit beiden offenen Behandlungen dieser Vorschau.", "Bu önizlemedeki iki açık tedaviyi de sunan kurgusal kolektif.") },
];

export const packages: DemoPackage[] = [
  pkg("demo-northlight-plan", "demo-northlight-hair", "hair-transplant", "Planning outline", 2400, 3, false, true),
  pkg("demo-bosphorus-plan", "demo-bosphorus-crown", "hair-transplant", "Stay and transfer outline", 3100, 4, true, true),
  pkg("demo-aegean-plan", "demo-aegean-strand", "hair-transplant", "Coastal outline", 1900, 2, false, true),
  pkg("demo-cappadocia-plan", "demo-cappadocia-follicle", "hair-transplant", "Stone city outline", 2100, 3, true, true),
  pkg("demo-golden-plan", "demo-golden-horn-smile", "dental-treatment", "Dental visit outline", 1600, 3, false, true),
  pkg("demo-turquoise-plan", "demo-turquoise-enamel", "dental-treatment", "Coast dental outline", 1400, 4, true, false),
  pkg("demo-levant-plan", "demo-levant-dental", "dental-treatment", "Aegean dental outline", 1750, 3, true, true),
  pkg("demo-marmara-hair-plan", "demo-marmara-care", "hair-transplant", "Collective hair outline", 2600, 3, true, true),
  pkg("demo-marmara-dental-plan", "demo-marmara-care", "dental-treatment", "Collective dental outline", 1500, 2, false, true),
];

function pkg(slug: string, providerSlug: string, treatmentSlug: string, title: string, priceEur: number, nights: number, includesHotel: boolean, includesTransfer: boolean): DemoPackage {
  return {
    slug,
    providerSlug,
    treatmentSlug,
    title: L(title, title, title),
    summary: L("Simulated package estimate. Not a quote.", "Simulierte Paketschätzung. Kein Angebot.", "Simülasyon paket tahmini. Teklif değildir."),
    priceEur,
    nights,
    includesHotel,
    includesTransfer,
    includesConsultation: true,
    isDemo: true,
  };
}

export const flights: DemoFlight[] = [
  flight("demo-fl-lhr-ist", "LHR", "IST", "DEMO Northline", "2026-11-12T09:20:00Z", "2026-11-12T15:05:00Z", 225, 240),
  flight("demo-fl-fra-ist", "FRA", "IST", "DEMO Skybridge", "2026-11-12T11:10:00Z", "2026-11-12T15:40:00Z", 210, 210),
  flight("demo-fl-cdg-ist", "CDG", "IST", "DEMO Harbor Wings", "2026-11-18T07:40:00Z", "2026-11-18T12:20:00Z", 220, 230),
  flight("demo-fl-ams-ist", "AMS", "IST", "DEMO Northline", "2026-11-18T13:05:00Z", "2026-11-18T17:50:00Z", 225, 205),
  flight("demo-fl-jfk-ist", "JFK", "IST", "DEMO Cinder Air", "2026-11-20T16:30:00Z", "2026-11-21T09:10:00Z", 580, 640),
  flight("demo-fl-dxb-ist", "DXB", "IST", "DEMO Skybridge", "2026-11-14T08:15:00Z", "2026-11-14T12:05:00Z", 290, 280),
  flight("demo-fl-ber-ayt", "BER", "AYT", "DEMO Harbor Wings", "2026-11-16T06:50:00Z", "2026-11-16T11:20:00Z", 210, 190),
  flight("demo-fl-zrh-adb", "ZRH", "ADB", "DEMO Cinder Air", "2026-11-22T10:00:00Z", "2026-11-22T14:05:00Z", 185, 220),
];

function flight(id: string, origin: string, destination: string, airline: string, departAt: string, arriveAt: string, durationMinutes: number, priceEur: number): DemoFlight {
  return { id, isDemo: true, origin, destination, airline, departAt, arriveAt, durationMinutes, priceEur, baggage: "1 cabin + 1 checked 23kg" };
}

export const hotels: DemoHotel[] = [
  hotel("demo-pera-house", "DEMO Pera House", "istanbul", 4.6, 180),
  hotel("demo-galata-rooms", "DEMO Galata Rooms", "istanbul", 4.4, 150),
  hotel("demo-karakoy-quay", "DEMO Karakoy Quay", "istanbul", 4.7, 210),
  hotel("demo-besiktas-court", "DEMO Besiktas Court", "istanbul", 4.5, 170),
  hotel("demo-antalya-shore", "DEMO Antalya Shore Inn", "antalya", 4.5, 160),
  hotel("demo-izmir-bay", "DEMO Izmir Bay Lodge", "izmir", 4.3, 120),
  hotel("demo-stone-court", "DEMO Stone Court", "nevsehir", 4.8, 190),
  hotel("demo-ankara-park", "DEMO Ankara Park Rooms", "ankara", 4.2, 110),
];

function hotel(id: string, name: string, citySlug: string, rating: number, pricePerNightEur: number): DemoHotel {
  return {
    id,
    isDemo: true,
    name,
    citySlug,
    rating,
    roomType: "DEMO quiet double",
    pricePerNightEur,
    amenities: ["Wi-Fi", "Breakfast outline", "Late checkout request"],
    cancellation: L("Simulation only: cancel up to 48 hours before arrival in this demo.", "Nur Simulation: im Demo bis 48 Stunden vorher stornierbar.", "Yalnızca simülasyon: bu demoda varıştan 48 saat öncesine kadar iptal."),
  };
}

export const transfers: DemoTransfer[] = [
  { id: "demo-tr-ist-air-hotel", isDemo: true, citySlug: "istanbul", route: "airport_hotel", vehicle: "DEMO sedan", passengers: 3, durationMinutes: 55, priceEur: 45 },
  { id: "demo-tr-ist-hotel-clinic", isDemo: true, citySlug: "istanbul", route: "hotel_clinic", vehicle: "DEMO sedan", passengers: 3, durationMinutes: 30, priceEur: 28 },
  { id: "demo-tr-ist-clinic-hotel", isDemo: true, citySlug: "istanbul", route: "clinic_hotel", vehicle: "DEMO sedan", passengers: 3, durationMinutes: 30, priceEur: 28 },
  { id: "demo-tr-ist-hotel-air", isDemo: true, citySlug: "istanbul", route: "hotel_airport", vehicle: "DEMO van", passengers: 6, durationMinutes: 60, priceEur: 62 },
  { id: "demo-tr-ayt-air-hotel", isDemo: true, citySlug: "antalya", route: "airport_hotel", vehicle: "DEMO sedan", passengers: 3, durationMinutes: 35, priceEur: 32 },
  { id: "demo-tr-ayt-hotel-air", isDemo: true, citySlug: "antalya", route: "hotel_airport", vehicle: "DEMO van", passengers: 6, durationMinutes: 40, priceEur: 48 },
];

export const cars: DemoCar[] = [
  { id: "demo-car-city", isDemo: true, name: "DEMO City Compact", citySlug: "istanbul", transmission: "automatic", seats: 5, luggage: 2, pricePerDayEur: 42 },
  { id: "demo-car-estate", isDemo: true, name: "DEMO Estate", citySlug: "istanbul", transmission: "automatic", seats: 5, luggage: 4, pricePerDayEur: 68 },
  { id: "demo-car-aegean", isDemo: true, name: "DEMO Aegean Hatch", citySlug: "izmir", transmission: "manual", seats: 5, luggage: 2, pricePerDayEur: 36 },
  { id: "demo-car-coast", isDemo: true, name: "DEMO Coast Wagon", citySlug: "antalya", transmission: "automatic", seats: 5, luggage: 3, pricePerDayEur: 54 },
  { id: "demo-car-stone", isDemo: true, name: "DEMO Stone SUV", citySlug: "nevsehir", transmission: "automatic", seats: 5, luggage: 4, pricePerDayEur: 79 },
  { id: "demo-car-capital", isDemo: true, name: "DEMO Capital Sedan", citySlug: "ankara", transmission: "automatic", seats: 5, luggage: 3, pricePerDayEur: 48 },
];

export const esims: DemoEsim[] = [
  { id: "demo-esim-5", isDemo: true, name: "DEMO Türkiye Data Pass 5GB", dataGb: 5, days: 7, priceEur: 12, destination: "TR" },
  { id: "demo-esim-10", isDemo: true, name: "DEMO Türkiye Data Pass 10GB", dataGb: 10, days: 15, priceEur: 18, destination: "TR" },
  { id: "demo-esim-20", isDemo: true, name: "DEMO Türkiye Data Pass 20GB", dataGb: 20, days: 30, priceEur: 29, destination: "TR" },
];

export const insurancePlans: DemoInsurance[] = [
  {
    id: "demo-cover-outline",
    isDemo: true,
    name: L("DEMO travel cover outline", "DEMO Reise-Schutzabriss", "DEMO seyahat teminat taslağı"),
    summary: L("A labeled outline of a travel-service module. It is not a policy, not medical cover, and not a guarantee.", "Ein gekennzeichneter Abriss eines Reiseservice. Keine Police, kein medizinischer Schutz, keine Garantie.", "Bir seyahat hizmeti modülünün etiketli taslağı. Poliçe, tıbbi teminat veya garanti değildir."),
    days: 14,
    priceEur: 36,
  },
  {
    id: "demo-cover-extended",
    isDemo: true,
    name: L("DEMO extended stay outline", "DEMO Abriss für längeren Aufenthalt", "DEMO uzatılmış kalış taslağı"),
    summary: L("Same simulation, longer window. Still not an insurance contract.", "Dieselbe Simulation, längeres Fenster. Immer noch kein Versicherungsvertrag.", "Aynı simülasyon, daha uzun aralık. Yine de bir sigorta sözleşmesi değildir."),
    days: 30,
    priceEur: 58,
  },
];

export const experiences: DemoExperience[] = [
  experience("demo-exp-bosphorus", "istanbul", "DEMO Bosphorus hour", 4, 70),
  experience("demo-exp-bazaar", "istanbul", "DEMO bazaar walk", 3, 40),
  experience("demo-exp-agora", "izmir", "DEMO agora morning", 3, 35),
  experience("demo-exp-coast", "antalya", "DEMO coast path", 4, 45),
  experience("demo-exp-oldtown", "antalya", "DEMO old-town lanes", 2, 25),
  experience("demo-exp-dawn", "nevsehir", "DEMO valley dawn", 3, 80),
  experience("demo-exp-valley", "nevsehir", "DEMO valley terrace", 2, 30),
  experience("demo-exp-citadel", "ankara", "DEMO citadel hour", 2, 28),
  experience("demo-exp-kitchen", "gaziantep", "DEMO kitchen table", 3, 55),
  experience("demo-exp-mosaic", "gaziantep", "DEMO mosaic room", 2, 22),
];

function experience(id: string, citySlug: string, name: string, hours: number, priceEur: number): DemoExperience {
  return {
    id,
    isDemo: true,
    citySlug,
    name: L(name, name, name),
    summary: L("Fictional hosted hour. Not a real operator.", "Fiktive Stunde. Kein echter Veranstalter.", "Kurgusal bir saat. Gerçek bir işletmeci değildir."),
    priceEur,
    hours,
  };
}

export const demoCommissionRules = [
  { id: "rule-treatment", service: "treatment" as const, mode: "percentage" as const, value: 8, providerId: null },
  { id: "rule-hotel", service: "hotel" as const, mode: "percentage" as const, value: 5, providerId: null },
  { id: "rule-transfer", service: "transfer" as const, mode: "percentage" as const, value: 6, providerId: null },
  { id: "rule-car", service: "car" as const, mode: "percentage" as const, value: 4, providerId: null },
  { id: "rule-esim", service: "esim" as const, mode: "percentage" as const, value: 10, providerId: null },
  { id: "rule-insurance", service: "insurance" as const, mode: "percentage" as const, value: 0, providerId: null },
  { id: "rule-experience", service: "experience" as const, mode: "percentage" as const, value: 7, providerId: null },
  { id: "rule-marmara-treatment", service: "treatment" as const, mode: "percentage" as const, value: 6, providerId: "demo-marmara-care" },
];

export function cityLabel(slug: string, locale: Locale): string {
  return destinations.find((city) => city.slug === slug)?.name[locale] ?? slug;
}

export function treatmentBySlug(slug: string): Treatment | undefined {
  return treatments.find((item) => item.slug === slug);
}

export function packagesFor(providerSlug: string): DemoPackage[] {
  return packages.filter((item) => item.providerSlug === providerSlug);
}
