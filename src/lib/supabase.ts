import { createClient } from "@supabase/supabase-js";
import { takeAuthRedirectErrorCode } from "./authRedirectError";

// Pages that use Supabase only render in the browser, but their modules are still imported while the landing page is
// prerendered on the server, where the env vars may be missing (as in CI). The server gets an inert placeholder client.
const IS_SERVER = typeof window === "undefined";
const SERVER_PLACEHOLDER_URL = "http://supabase.invalid";
const SERVER_PLACEHOLDER_KEY = "server-placeholder";

// Taken before the client is created, so the client doesn't try to process the failed redirect itself.
export const authRedirectErrorCode = takeAuthRedirectErrorCode();

export const supabase = IS_SERVER
  ? createClient(SERVER_PLACEHOLDER_URL, SERVER_PLACEHOLDER_KEY, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    })
  : createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY);
