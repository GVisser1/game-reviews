import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useLocation, useRouter } from "@tanstack/react-router";
import { isNil } from "lodash-es";
import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { toErrorMessage } from "../../utils/errorUtil";
import { ownUsernameQueryOptions } from "../profiles/profileQuery";
import { SignInLink } from "./SignInLink";
import { useAuthUser } from "./useAuthUser";
import { getAvatarUrl, getDisplayName, LOGIN_PATH } from "./utils/authUtil";

export const AccountMenu = (): React.JSX.Element | null => {
  const user = useAuthUser();
  const isOnLoginPage = useLocation({ select: (location) => location.pathname === LOGIN_PATH });
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isSignedIn = !isNil(user) && !user.is_anonymous;
  const { data: username } = useQuery({ ...ownUsernameQueryOptions(user?.id ?? ""), enabled: isSignedIn });

  const signOut = async (): Promise<void> => {
    setIsSigningOut(true);
    setError(null);
    try {
      await supabase.auth.signOut();
      // Dropping all cached data (including the session) makes the root route sign in anonymously again.
      queryClient.clear();
      await router.invalidate();
    } catch (signOutError) {
      setError(toErrorMessage(signOutError));
    }
    setIsSigningOut(false);
  };

  if (isNil(user)) {
    return null;
  }

  if (user.is_anonymous) {
    return isOnLoginPage ? null : <SignInLink />;
  }

  const avatarUrl = getAvatarUrl(user);
  return (
    <div className="flex items-center gap-2">
      {/* Your profile, or the account page until your username has loaded (or for a profile that's still being set up). */}
      <Link
        {...(isNil(username) ? { to: "/app/account" } : { to: "/app/users/$username", params: { username } })}
        className="flex items-center gap-2 text-small hover:underline"
      >
        {avatarUrl && <img src={avatarUrl} alt="" className="size-6 rounded-full" />}
        {getDisplayName(user)}
      </Link>
      <button
        type="button"
        disabled={isSigningOut}
        onClick={() => void signOut()}
        className="rounded border px-3 py-1 text-small hover:bg-surface-raised disabled:opacity-50"
      >
        Sign out
      </button>
      {error && <span className="text-small text-danger">{error}</span>}
    </div>
  );
};
