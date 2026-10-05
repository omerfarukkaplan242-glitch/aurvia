import type { Metadata } from "next";
import { headers } from "next/headers";
import { Manrope, Newsreader } from "next/font/google";
import { isLocale } from "@/lib/i18n/config";
import "./globals.css";

const sans = Manrope({ subsets: ["latin"], variable: "--font-manrope" });
const serif = Newsreader({ subsets: ["latin"], variable: "--font-newsreader" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: { default: "AURVIA", template: "%s · AURVIA" },
  description: "One platform for your complete medical journey to Türkiye.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const path = (await headers()).get("x-aurvia-path") ?? "";
  const segment = path.split("/").filter(Boolean)[0] ?? "en";
  const lang = isLocale(segment) ? segment : "en";
  return (
    <html lang={lang} className={`${sans.variable} ${serif.variable} h-full`}>
      <body className="min-h-full antialiased">{children}</body>
    </html>
  );
}
