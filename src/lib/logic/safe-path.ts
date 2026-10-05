const LOCALES = ["en", "de", "tr"] as const;

export function safeReturnPath(locale: string, value: unknown, fallback: string): string {
  const fb = fallback.startsWith("/") ? fallback : `/${locale}`;
  if (typeof value !== "string" || value.length === 0 || value.length > 500) return fb;
  if (!value.startsWith("/") || value.startsWith("//") || value.includes("\\") || value.includes("://")) return fb;
  const path = value.split("?")[0]?.split("#")[0] ?? "";
  if (path.includes("..")) return fb;
  const allowed = LOCALES.some((item) => path === `/${item}` || path.startsWith(`/${item}/`));
  if (!allowed || !(path === `/${locale}` || path.startsWith(`/${locale}/`))) return fb;
  return value;
}
