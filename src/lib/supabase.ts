import { createClient } from "@supabase/supabase-js";
import { takeAuthRedirectErrorCode } from "./authRedirectError";

// Taken before the client is created, so the client doesn't try to process the failed redirect itself.
export const authRedirectErrorCode = takeAuthRedirectErrorCode();

export const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY);
