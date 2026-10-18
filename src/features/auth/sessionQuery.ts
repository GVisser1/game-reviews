import { queryOptions } from "@tanstack/react-query";
import { isNil } from "lodash-es";
import { supabase } from "../../lib/supabase";
import { getTurnstileToken } from "../../lib/turnstile";

const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY;

const ensureAnonymousSession = async (): Promise<true> => {
  const { data } = await supabase.auth.getSession();
  if (!isNil(data.session)) {
    return true;
  }

  // Supabase verifies the Turnstile token before creating the anonymous user, which keeps bots from mass-creating them.
  const captchaToken = TURNSTILE_SITE_KEY ? await getTurnstileToken(TURNSTILE_SITE_KEY) : undefined;
  const { error } = await supabase.auth.signInAnonymously({ options: { captchaToken } });
  if (!isNil(error)) {
    throw error;
  }
  return true;
};

export const sessionQueryOptions = queryOptions({
  queryKey: ["session"],
  queryFn: ensureAnonymousSession,
  staleTime: Infinity,
  retry: false,
});
