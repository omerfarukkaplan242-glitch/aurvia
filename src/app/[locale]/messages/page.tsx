import { redirect, notFound } from "next/navigation";
import { sendMessage } from "@/lib/actions";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { isLocale, localePath } from "@/lib/i18n/config";
import { createClient } from "@/lib/supabase/server";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return pageMetadata(locale, getDictionary(locale).messages.title, "/messages", getDictionary(locale).messages.empty);
}

export default async function MessagesPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const query = await searchParams;
  const d = getDictionary(locale);
  const supabase = await createClient();
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;
  if (!user) redirect(localePath(locale, "/login"));
  const { data: conversations, error } = await supabase!.from("conversations").select("id, created_at").order("created_at", { ascending: false });
  const first = conversations?.[0]?.id;
  const { data: messages } = first
    ? await supabase!.from("messages").select("id, body, created_at, sender_id, read_at").eq("conversation_id", first).order("created_at")
    : { data: [] };
  return (
    <section className="px-5 py-12 md:px-10">
      <h1 className="serif text-5xl text-white">{d.messages.title}</h1>
      {query.error ? <p role="alert" className="mt-4">{d.common.error}</p> : null}
      {error ? <p role="alert">{d.common.error} <a href={localePath(locale, "/messages")}>{d.common.retry}</a></p> : null}
      {!error && (conversations ?? []).length === 0 ? <p className="mt-6" role="status">{d.messages.empty}</p> : null}
      <ul className="mt-6 space-y-3">
        {(messages ?? []).map((message) => (
          <li key={message.id} className="rounded-2xl border border-line px-4 py-3">
            <p>{message.body}</p>
            <p className="text-xs text-faint">{new Date(message.created_at).toLocaleString(locale)} {message.read_at ? "" : `· ${d.messages.unread}`}</p>
          </li>
        ))}
      </ul>
      {first ? (
        <form action={sendMessage} className="mt-6 grid gap-3">
          <input type="hidden" name="locale" value={locale} />
          <input type="hidden" name="conversationId" value={first} />
          <label>{d.messages.placeholder}<textarea name="body" required maxLength={4000} className="mt-1 w-full rounded-xl bg-midnight px-3 py-3" /></label>
          <button className="w-fit rounded-full bg-cyan px-4 py-3 font-semibold text-ink" type="submit">{d.messages.send}</button>
        </form>
      ) : null}
    </section>
  );
}
