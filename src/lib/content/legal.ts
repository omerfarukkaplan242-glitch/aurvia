import type { Locale } from "../i18n/config";

export const LEGAL_SLUGS = ["privacy", "terms", "cookies", "medical", "travel", "refund"] as const;
export type LegalSlug = (typeof LEGAL_SLUGS)[number];

export function isLegalSlug(value: string): value is LegalSlug {
  return (LEGAL_SLUGS as readonly string[]).includes(value);
}

type LegalDoc = { title: string; body: string[] };

const counsel = {
  en: "This text is a product template. Have qualified counsel review it before a public launch.",
  de: "Dieser Text ist eine Produktvorlage. Lassen Sie ihn vor einem öffentlichen Start rechtlich prüfen.",
  tr: "Bu metin bir ürün şablonudur. Herkese açık kullanımdan önce nitelikli bir hukukçuyla gözden geçirin.",
};

export const legalDocuments: Record<LegalSlug, Record<Locale, LegalDoc>> = {
  privacy: {
    en: {
      title: "Privacy Policy",
      body: [
        "AURVIA stores the account details you submit, travel preferences, messages, and files you choose to upload.",
        "Files in the document vault are private. They are not published on a public URL.",
        "Analytics events record page type, language, and optional treatment or provider slugs. They are not a place for diagnoses or free-text medical history.",
        "We do not sell personal data. Service-role credentials are never sent to the browser.",
        counsel.en,
      ],
    },
    de: {
      title: "Datenschutz",
      body: [
        "AURVIA speichert Kontodaten, Reisepräferenzen, Nachrichten und Dateien, die Sie hochladen.",
        "Dateien im Tresor sind privat und werden nicht über eine öffentliche URL bereitgestellt.",
        "Analyseereignisse speichern Seitentyp, Sprache und optionale Slugs. Keine Diagnosen und keine freie Krankengeschichte.",
        "Wir verkaufen keine personenbezogenen Daten. Service-Role-Schlüssel erreichen den Browser nicht.",
        counsel.de,
      ],
    },
    tr: {
      title: "Gizlilik Politikası",
      body: [
        "AURVIA, hesap bilgilerinizi, seyahat tercihlerinizi, mesajlarınızı ve yüklediğiniz dosyaları saklar.",
        "Belge kasasındaki dosyalar gizlidir. Herkese açık bir URL’de yayımlanmaz.",
        "Analitik olaylar sayfa türünü, dili ve isteğe bağlı slug’ları kaydeder. Tanı veya serbest tıbbi öykü yeri değildir.",
        "Kişisel veriyi satmayız. Service-role anahtarları tarayıcıya gönderilmez.",
        counsel.tr,
      ],
    },
  },
  terms: {
    en: {
      title: "Terms of Service",
      body: [
        "AURVIA helps you organize information, comparison, and requests for a medical trip. It is not a hospital, clinic, insurer, or government body.",
        "Demo flights, hotels, transfers, cars, eSIMs, experiences, and provider profiles are simulations. They are not offers from real partners.",
        "Submitting a request does not create a medical appointment or a paid booking.",
        "You must not rely on this product for diagnosis, prescriptions, or emergency care.",
        counsel.en,
      ],
    },
    de: {
      title: "Nutzungsbedingungen",
      body: [
        "AURVIA hilft, Informationen, Vergleiche und Anfragen für eine medizinische Reise zu ordnen. Es ist kein Krankenhaus, keine Klinik, kein Versicherer und keine Behörde.",
        "Demo-Flüge, Hotels, Transfers, Autos, eSIMs, Erlebnisse und Anbieterprofile sind Simulationen.",
        "Eine Anfrage erzeugt weder einen medizinischen Termin noch eine bezahlte Buchung.",
        "Nutzen Sie dieses Produkt nicht für Diagnose, Rezepte oder Notfälle.",
        counsel.de,
      ],
    },
    tr: {
      title: "Hizmet Şartları",
      body: [
        "AURVIA, bir medikal seyahat için bilgi, karşılaştırma ve talepleri düzenlemenize yardım eder. Hastane, klinik, sigortacı veya kamu kurumu değildir.",
        "Demo uçuşlar, oteller, transferler, araçlar, eSIM’ler, deneyimler ve sağlayıcı profilleri simülasyondur. Gerçek ortak teklifi değildir.",
        "Talep göndermek tıbbi randevu veya ücretli rezervasyon oluşturmaz.",
        "Bu ürünü tanı, reçete veya acil bakım için kullanmayın.",
        counsel.tr,
      ],
    },
  },
  cookies: {
    en: {
      title: "Cookie Policy",
      body: [
        "Essential cookies keep your session and your currency choice.",
        "A comparison list may be stored in a cookie on this device.",
        "Analytics, when enabled, avoid medical free text. You can use the product without marketing cookies.",
        counsel.en,
      ],
    },
    de: {
      title: "Cookie-Richtlinie",
      body: [
        "Notwendige Cookies halten Sitzung und Währung.",
        "Eine Vergleichsliste kann in einem Cookie auf diesem Gerät liegen.",
        "Analysen vermeiden medizinischen Freitext. Das Produkt funktioniert ohne Marketing-Cookies.",
        counsel.de,
      ],
    },
    tr: {
      title: "Çerez Politikası",
      body: [
        "Zorunlu çerezler oturumunuzu ve para birimi seçiminizi tutar.",
        "Karşılaştırma listesi bu cihazda bir çerezde durabilir.",
        "Analitik, açık olduğunda tıbbi serbest metinden kaçınır. Ürün pazarlama çerezleri olmadan kullanılabilir.",
        counsel.tr,
      ],
    },
  },
  medical: {
    en: {
      title: "Medical Disclaimer",
      body: [
        "AURVIA does not diagnose, prescribe, rank clinical quality, or promise outcomes.",
        "Matching explains logistical overlap such as treatment type, city, budget, and language.",
        "Only a qualified professional who has assessed you can recommend care.",
        "Verified badges are shown only when a verification record exists. Demo profiles are not verified.",
        counsel.en,
      ],
    },
    de: {
      title: "Medizinischer Hinweis",
      body: [
        "AURVIA diagnostiziert nicht, verschreibt nicht, bewertet keine klinische Qualität und verspricht keine Ergebnisse.",
        "Zuordnungen erklären organisatorische Überschneidungen wie Behandlungsart, Stadt, Budget und Sprache.",
        "Nur eine qualifizierte Fachperson, die Sie untersucht hat, kann Versorgung empfehlen.",
        "Verifiziert-Abzeichen erscheinen nur mit einem echten Prüfdatensatz. Demo-Profile sind nicht verifiziert.",
        counsel.de,
      ],
    },
    tr: {
      title: "Tıbbi Sorumluluk Reddi",
      body: [
        "AURVIA tanı koymaz, reçete yazmaz, klinik kalite sıralamaz ve sonuç vaat etmez.",
        "Eşleştirme; tedavi türü, şehir, bütçe ve dil gibi lojistik örtüşmeyi açıklar.",
        "Bakımı yalnızca sizi değerlendiren nitelikli bir profesyonel önerebilir.",
        "Doğrulandı rozeti yalnızca bir doğrulama kaydı varsa görünür. Demo profiller doğrulanmış değildir.",
        counsel.tr,
      ],
    },
  },
  travel: {
    en: {
      title: "Travel Disclaimer",
      body: [
        "Simulated flights, hotels, transfers, cars, and experiences cannot be ticketed from this preview.",
        "You are responsible for passports, visas, and entry rules.",
        "AURVIA does not claim to be an accredited travel agency or a government travel service.",
        counsel.en,
      ],
    },
    de: {
      title: "Reisehinweis",
      body: [
        "Simulierte Flüge, Hotels, Transfers, Autos und Erlebnisse können in dieser Vorschau nicht ausgestellt werden.",
        "Pässe, Visa und Einreisebestimmungen liegen bei Ihnen.",
        "AURVIA behauptet nicht, ein zugelassenes Reisebüro oder ein staatlicher Reisedienst zu sein.",
        counsel.de,
      ],
    },
    tr: {
      title: "Seyahat Sorumluluk Reddi",
      body: [
        "Simüle uçuş, otel, transfer, araç ve deneyimler bu önizlemeden biletlenemez.",
        "Pasaport, vize ve giriş kuralları size aittir.",
        "AURVIA, akredite bir seyahat acentesi veya devlet seyahat hizmeti olduğunu iddia etmez.",
        counsel.tr,
      ],
    },
  },
  refund: {
    en: {
      title: "Refund and cancellation",
      body: [
        "Simulation payments do not charge a card and do not create a refundable balance.",
        "When a live payment provider is connected later, cancellation terms must be shown before you confirm.",
        "Demo hotel cards show a simulated 48-hour cancellation note. That note is not a contract with a hotel.",
        counsel.en,
      ],
    },
    de: {
      title: "Erstattung und Stornierung",
      body: [
        "Simulierte Zahlungen belasten keine Karte und erzeugen kein erstattungsfähiges Guthaben.",
        "Wenn später ein echter Zahlungsanbieter verbunden wird, müssen Stornobedingungen vor der Bestätigung sichtbar sein.",
        "Demo-Hotelkarten zeigen einen simulierten 48-Stunden-Hinweis. Das ist kein Hotelvertrag.",
        counsel.de,
      ],
    },
    tr: {
      title: "İade ve iptal",
      body: [
        "Simülasyon ödemeleri karttan çekim yapmaz ve iade edilebilir bir bakiye oluşturmaz.",
        "Daha sonra canlı bir ödeme sağlayıcısı bağlanırsa, iptal koşulları onaydan önce gösterilmelidir.",
        "Demo otel kartları simüle 48 saatlik bir iptal notu gösterir. Bu bir otel sözleşmesi değildir.",
        counsel.tr,
      ],
    },
  },
};
