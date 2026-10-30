import { useQueryClient } from "@tanstack/react-query";
import { Link, useRouter } from "@tanstack/react-router";
import { isNil } from "lodash-es";
import { useState } from "react";
import { Heading } from "../../shared/Heading";
import { toErrorMessage } from "../../utils/errorUtil";
import { deleteAccount } from "./deleteAccount";
import { SignInPrompt } from "./SignInPrompt";
import { useAuthUser } from "./useAuthUser";
import { getAvatarUrl, getDisplayName } from "./utils/authUtil";

const BUTTON_CLASS_NAME = "rounded border px-3 py-1 text-sm hover:bg-gray-100 disabled:opacity-50";

export const AccountPage = (): React.JSX.Element | null => {
  const user = useAuthUser();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isConfirming, setIsConfirming] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (isNil(user)) {
    return null;
  }
  if (user.is_anonymous) {
    return <SignInPrompt message="Sign in to manage your account." />;
  }

  const confirmDelete = async (): Promise<void> => {
    setIsDeleting(true);
    setError(null);
    try {
      await deleteAccount();
      queryClient.clear();
      await router.navigate({ to: "/" });
    } catch (deleteError) {
      setError(toErrorMessage(deleteError));
      setIsDeleting(false);
    }
  };

  const avatarUrl = getAvatarUrl(user);

  return (
    <div className="flex max-w-xl flex-col gap-6">
      <Heading as="h1" className="text-2xl font-bold">
        Account
      </Heading>
      <div className="flex items-center gap-3">
        {avatarUrl && <img src={avatarUrl} alt="" className="size-10 rounded-full" />}
        <div className="flex flex-col">
          <span className="font-medium">{getDisplayName(user)}</span>
          <span className="text-sm text-gray-600">Signed in with Twitch</span>
        </div>
      </div>

      <section className="flex flex-col gap-2">
        <Heading as="h2" className="text-lg font-bold">
          Delete account
        </Heading>
        <p>
          Deletes your account, your profile and all your ratings and reviews. This can't be undone. See the{" "}
          <Link to="/privacy" className="underline">
            privacy page
          </Link>{" "}
          for what's stored.
        </p>
        <p className="text-sm text-gray-600">
          This doesn't remove the app from your Twitch account. To do that, disconnect it in Twitch under Settings →
          Connections.
        </p>
        {!isConfirming && (
          <button type="button" onClick={() => setIsConfirming(true)} className={`self-start ${BUTTON_CLASS_NAME}`}>
            Delete my account
          </button>
        )}
        {isConfirming && (
          <div className="flex flex-col gap-2 rounded border border-red-300 p-3">
            <p className="font-medium">Delete your account and all your reviews for good?</p>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => void confirmDelete()}
                className="rounded bg-red-700 px-3 py-1 text-sm text-white hover:bg-red-800 disabled:opacity-50"
              >
                Yes, delete my account
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setIsConfirming(false)}
                className={BUTTON_CLASS_NAME}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
        {error && <p className="text-red-600">Could not delete your account: {error}</p>}
      </section>
    </div>
  );
};
