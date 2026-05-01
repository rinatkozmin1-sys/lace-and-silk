import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cached: SupabaseClient | null = null;

/**
 * Серверный клиент с service role — только на сервере (Route Handlers, SSR).
 * Не добавляйте SERVICE_ROLE в NEXT_PUBLIC_*.
 */
export function getSupabaseAdmin(): SupabaseClient | null {
  if (cached) return cached;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRole) return null;
  cached = createClient(url, serviceRole, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cached;
}
