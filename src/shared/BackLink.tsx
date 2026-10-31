import { Link, useCanGoBack, useRouter } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";
import { Icon } from "./Icon";

type BackLinkProps = {
  /** The link text, like "All games". The back arrow comes before it. */
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
      className="inline-flex items-center gap-1 self-start text-small hover:underline"
    >
      <Icon icon={ArrowLeft} />
      {children}
    </Link>
  );
};
