import { Link, Outlet } from "@tanstack/react-router";
import type { ErrorComponentProps } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { AccountMenu } from "./features/auth/AccountMenu";
import { toErrorMessage } from "./lib/toErrorMessage";

const NAV_LINK_CLASS_NAME = "hover:underline";
const ACTIVE_NAV_LINK_PROPS = { className: "font-bold underline" };

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps): React.JSX.Element => (
  <>
    <nav className="flex items-center gap-4 border-b p-4">
      <Link
        to="/app"
        search={{ q: undefined }}
        className={NAV_LINK_CLASS_NAME}
        activeProps={ACTIVE_NAV_LINK_PROPS}
        activeOptions={{ exact: true, includeSearch: false }}
      >
        Games
      </Link>
      <Link to="/app/my-reviews" className={NAV_LINK_CLASS_NAME} activeProps={ACTIVE_NAV_LINK_PROPS}>
        My reviews
      </Link>
      <div className="ml-auto">
        <AccountMenu />
      </div>
    </nav>
    <main className="p-4">{children}</main>
  </>
);

export const AppLayout = (): React.JSX.Element => (
  <Layout>
    <Outlet />
  </Layout>
);

// Shown while the app signs the visitor in, which waits for Cloudflare Turnstile and can take a moment.
export const AppPending = (): React.JSX.Element => (
  <Layout>
    <p>Checking your browser…</p>
    <p className="text-sm text-gray-600">If a checkbox appears in the corner, tick it to continue.</p>
  </Layout>
);

export const AppError = ({ error }: ErrorComponentProps): React.JSX.Element => (
  <Layout>
    <p className="text-red-600">Something went wrong: {toErrorMessage(error)}</p>
  </Layout>
);
