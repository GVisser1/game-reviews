import { useSearch } from "@tanstack/react-router";
import { useState } from "react";
import { authRedirectErrorCode } from "../../lib/supabase";
import { toErrorMessage } from "../../lib/toErrorMessage";
import { signInWithTwitch } from "./twitchSignIn";

export const LoginPage = (): React.JSX.Element => {
  const { redirect } = useSearch({ from: "/login" });
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [error, setError] = useState<string | null>(
    authRedirectErrorCode && "Sign-in didn't complete. Please try again.",
  );

  const continueWithTwitch = async (): Promise<void> => {
    setIsRedirecting(true);
    setError(null);
    try {
      await signInWithTwitch(redirect);
    } catch (signInError) {
      setError(toErrorMessage(signInError));
      setIsRedirecting(false);
    }
  };

  return (
    <div className="mx-auto mt-12 flex max-w-sm flex-col gap-4">
      <h1 className="text-2xl font-bold">Sign in</h1>
      <p className="text-gray-600">Sign in to rate games and keep track of your reviews.</p>
      <button
        type="button"
        disabled={isRedirecting}
        onClick={() => void continueWithTwitch()}
        className="rounded border px-4 py-2 hover:bg-gray-100 disabled:opacity-50"
      >
        Continue with Twitch
      </button>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};
