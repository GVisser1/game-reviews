import { Link, useCanGoBack, useRouter } from "@tanstack/react-router";
import type { ReactNode } from "react";

type BackLinkProps = {
  /** The link text, like "← All games". */
  children: ReactNode;
};

// Going back in history (instead of linking to "/app") keeps the previous search and scroll position.
export const BackLink = ({ children }: BackLinkProps): React.JSX.Element => {
  const router = useRouter();
  const canGoBack = useCanGoBack();

  return (
    <Link
      to="/app"
      search={{ q: undefined }}
      onClick={(event) => {
        if (canGoBack) {
          event.preventDefault();
          router.history.back();
        }
      }}
      className="self-start text-small hover:underline"
    >
      {children}
    </Link>
  );
};
