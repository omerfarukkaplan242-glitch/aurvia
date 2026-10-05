import { NextResponse } from "next/server";
import { analyticsSchema } from "@/lib/logic/validation";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = analyticsSchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ ok: false }, { status: 400 });
  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ ok: true, stored: false });
  const { data: { user } } = await supabase.auth.getUser();
  await supabase.from("analytics_events").insert({
    event_name: parsed.data.event,
    path: parsed.data.path,
    locale: parsed.data.locale,
    treatment_slug: parsed.data.treatmentSlug ?? null,
    provider_slug: parsed.data.providerSlug ?? null,
    user_id: user?.id ?? null,
  });
  return NextResponse.json({ ok: true });
}
