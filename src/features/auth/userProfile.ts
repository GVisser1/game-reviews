import type { User } from "@supabase/supabase-js";
import { compact, find, isString } from "lodash-es";

const FALLBACK_DISPLAY_NAME = "Twitch user";
const TWITCH_PROVIDER = "twitch";
// Providers differ in which profile keys they fill in, so try the common ones in order.
const DISPLAY_NAME_KEYS = ["nickname", "full_name", "name", "preferred_username", "user_name"];
const AVATAR_URL_KEYS = ["avatar_url", "picture"];

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
