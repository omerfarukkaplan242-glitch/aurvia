import { createBrowserClient } from "@supabase/ssr";
import { publicEnv } from "./env";

export function createClient() {
  const env = publicEnv();
  if (!env) return null;
  return createBrowserClient(env.url, env.key);
}
