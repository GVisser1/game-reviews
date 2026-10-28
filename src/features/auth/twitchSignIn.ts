import { isNil } from "lodash-es";
import { supabase } from "../../lib/supabase";
import { LOGIN_PATH } from "./utils/authUtil";

const TWITCH_PROVIDER = "twitch";

// Twitch returns to the login page rather than the original page, so the login page can show a failed sign-in and
// forward a successful one to `redirectPath`.
export const signInWithTwitch = async (redirectPath: string | undefined): Promise<void> => {
  const returnUrl = new URL(LOGIN_PATH, window.location.origin);
  if (!isNil(redirectPath)) {
    returnUrl.searchParams.set("redirect", redirectPath);
  }

  const { error } = await supabase.auth.signInWithOAuth({
    provider: TWITCH_PROVIDER,
    options: { redirectTo: returnUrl.toString() },
  });
  if (!isNil(error)) {
    throw error;
  }
};
