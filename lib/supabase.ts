import { createClient } from "@supabase/supabase-js";

const storageEnvKeys = ["SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY", "SUPABASE_STORAGE_BUCKET"] as const;

export function getMissingSupabaseStorageEnvVars() {
  return storageEnvKeys.filter((key) => !process.env[key] || process.env[key]?.trim() === "");
}

export function isSupabaseStorageConfigured() {
  return getMissingSupabaseStorageEnvVars().length === 0;
}

export function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    const missing = getMissingSupabaseStorageEnvVars();
    throw new Error(
      missing.length > 0
        ? `Missing Supabase env vars: ${missing.join(", ")}`
        : "Supabase env vars are not configured."
    );
  }

  return createClient(url, serviceKey, {
    auth: { persistSession: false }
  });
}
