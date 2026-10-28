import { createFileRoute, redirect } from "@tanstack/react-router";
import { LoginPage } from "../features/auth/LoginPage";
import { validateLoginSearch } from "../features/auth/utils/authUtil";
import { supabase } from "../lib/supabase";
import { pageHead } from "../utils/pageHeadUtil";

const APP_PATH = "/app";

export const Route = createFileRoute("/login")({
  ssr: false,
  head: () => pageHead("Sign in"),
  validateSearch: validateLoginSearch,
  // Signed-in users (including those just returning from Twitch) go on to where they came from.
  beforeLoad: async ({ search }) => {
    const { data } = await supabase.auth.getSession();
    if (data.session?.user.is_anonymous === false) {
      throw redirect({ href: search.redirect ?? APP_PATH, replace: true });
    }
  },
  component: LoginPage,
});
