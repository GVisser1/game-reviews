import type { User } from "@supabase/supabase-js";
import { compact, find, isString } from "lodash-es";

export const LOGIN_PATH = "/login";
// Only used to resolve the path; any value that resolves to a different origin points outside this app.
const PLACEHOLDER_ORIGIN = "https://app.invalid";

const FALLBACK_DISPLAY_NAME = "Twitch user";
const TWITCH_PROVIDER = "twitch";
// Providers differ in which profile keys they fill in, so try the common ones in order.
const DISPLAY_NAME_KEYS = ["nickname", "full_name", "name", "preferred_username", "user_name"];
const AVATAR_URL_KEYS = ["avatar_url", "picture"];

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

// Linking Twitch to an anonymous user keeps Twitch's profile on the identity, not in user_metadata,
// so check the Twitch identity first.
const getProfileSources = (user: User): Record<string, unknown>[] => {
  const twitchIdentity = find(user.identities, { provider: TWITCH_PROVIDER });
  return compact([twitchIdentity?.identity_data, user.user_metadata]);
};

const findProfileString = (user: User, keys: string[]): string | undefined => {
  const candidates = getProfileSources(user).flatMap((source) => keys.map((key) => source[key]));
  const value = find(candidates, (candidate) => isString(candidate) && candidate !== "");
  return isString(value) ? value : undefined;
};

export const getDisplayName = (user: User): string =>
  findProfileString(user, DISPLAY_NAME_KEYS) ?? FALLBACK_DISPLAY_NAME;

export const getAvatarUrl = (user: User): string | null => findProfileString(user, AVATAR_URL_KEYS) ?? null;
