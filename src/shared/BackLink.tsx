import { Link, useCanGoBack, useRouter } from "@tanstack/react-router";
import type { ReactNode } from "react";

type BackLinkProps = {
  children: ReactNode;
};

// Going back in history (instead of linking to "/") keeps the previous search and scroll position.
export const BackLink = ({ children }: BackLinkProps): React.JSX.Element => {
  const router = useRouter();
  const canGoBack = useCanGoBack();

  return (
    <Link
      to="/"
      onClick={(event) => {
        if (canGoBack) {
          event.preventDefault();
          router.history.back();
        }
      }}
      className="self-start text-sm hover:underline"
    >
      {children}
    </Link>
  );
};
