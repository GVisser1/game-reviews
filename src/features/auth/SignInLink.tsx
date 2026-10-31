import { Link, useLocation } from "@tanstack/react-router";
import { toSafeRedirectPath } from "./utils/authUtil";

export const SignInLink = (): React.JSX.Element => {
  const currentPath = useLocation({ select: (location) => location.href });

  return (
    <Link
      to="/login"
      search={{ redirect: toSafeRedirectPath(currentPath) }}
      className="rounded border px-3 py-1 text-small hover:bg-surface-raised"
    >
      Sign in
    </Link>
  );
};
