import { createFileRoute, redirect } from "@tanstack/react-router";
import { isNil } from "lodash-es";
import { LOGIN_PATH } from "../../features/auth/utils/authUtil";
import { ownUsernameQueryOptions } from "../../features/profiles/profileQuery";
import { supabase } from "../../lib/supabase";

const MY_REVIEWS_PATH = "/app/my-reviews";

// Your reviews now live on your profile. This keeps old links working: signed-in players go to their profile, anyone
// else signs in first and comes back here.
export const Route = createFileRoute("/app/my-reviews")({
  beforeLoad: async ({ context }) => {
    const { data } = await supabase.auth.getSession();
    const user = data.session?.user;
    if (isNil(user) || user.is_anonymous) {
      throw redirect({ to: LOGIN_PATH, search: { redirect: MY_REVIEWS_PATH }, replace: true });
    }

    const username = await context.queryClient.query({ ...ownUsernameQueryOptions(user.id), staleTime: "static" });
    throw isNil(username)
      ? redirect({ to: "/app/account", replace: true })
      : redirect({ to: "/app/users/$username", params: { username }, replace: true });
  },
});
