import { useQueryClient } from "@tanstack/react-query";
import { useLocation, useRouter } from "@tanstack/react-router";
import { isNil } from "lodash";
import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { toErrorMessage } from "../../lib/toErrorMessage";
import { LOGIN_PATH } from "./loginRedirect";
import { SignInLink } from "./SignInLink";
import { useAuthUser } from "./useAuthUser";
import { getAvatarUrl, getDisplayName } from "./userProfile";

export const AccountMenu = (): React.JSX.Element | null => {
  const user = useAuthUser();
  const isOnLoginPage = useLocation({ select: (location) => location.pathname === LOGIN_PATH });
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      {avatarUrl && <img src={avatarUrl} alt="" className="size-6 rounded-full" />}
      <span className="text-sm">{getDisplayName(user)}</span>
      <button
        type="button"
        disabled={isSigningOut}
        onClick={() => void signOut()}
        className="rounded border px-3 py-1 text-sm hover:bg-gray-100 disabled:opacity-50"
      >
        Sign out
      </button>
      {error && <span className="text-sm text-red-600">{error}</span>}
    </div>
  );
};
