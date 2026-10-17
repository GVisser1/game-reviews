import { isString } from "lodash";

export const LOGIN_PATH = "/login";
// Only used to resolve the path; any value that resolves to a different origin points outside this app.
const PLACEHOLDER_ORIGIN = "https://app.invalid";

export type LoginSearch = {
  redirect?: string;
};

// Accepts only paths within this app, so a shared link like /login?redirect=https://evil.example can't use the login
// page to send people elsewhere. "//host" and "/\host" are rejected because browsers treat them as other hosts.
export const toSafeRedirectPath = (value: unknown): string | undefined => {
  if (!isString(value) || !value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) {
    return undefined;
  }

  const url = new URL(value, PLACEHOLDER_ORIGIN);
  if (url.origin !== PLACEHOLDER_ORIGIN || url.pathname === LOGIN_PATH) {
    return undefined;
  }
  return `${url.pathname}${url.search}${url.hash}`;
};

export const validateLoginSearch = (search: Record<string, unknown>): LoginSearch => ({
  redirect: toSafeRedirectPath(search.redirect),
});
