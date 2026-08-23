import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Both must be referenced as full literals so Next inlines them into the
// client bundle. See supabase/README.md for the values and the table schema.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && anonKey);

let client: SupabaseClient | null = null;

/** The browser client, or null when the env vars are not set yet. */
export function getSupabase(): SupabaseClient | null {
  if (!url || !anonKey) return null;
  if (!client) {
    client = createClient(url, anonKey, { auth: { persistSession: false } });
  }
  return client;
}
