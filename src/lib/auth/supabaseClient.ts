import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

function isValidUrl(url: string | undefined): boolean {
  if (!url) return false;
  return url.startsWith("http://") || url.startsWith("https://");
}

const finalUrl = isValidUrl(supabaseUrl) ? supabaseUrl! : "https://placeholder-project.supabase.co";
const finalAnonKey = (supabaseAnonKey && supabaseAnonKey !== "your_supabase_anon_key") ? supabaseAnonKey : "placeholder-anon-key";

// Node.js 20 SSR WebSocket polyfill to prevent Realtime error on server
if (typeof window === "undefined") {
  if (!globalThis.WebSocket) {
    globalThis.WebSocket = class {} as any;
  }
}

if (!isValidUrl(supabaseUrl) || !supabaseAnonKey || supabaseAnonKey === "your_supabase_anon_key") {
  console.warn("Supabase URL or Anon Key is invalid or placeholder. Using placeholder client.");
}

export const supabase = createClient(finalUrl, finalAnonKey);
