import type { PostgrestSingleResponse } from "@supabase/supabase-js";
import { queryOptions } from "@tanstack/react-query";
import { isNil } from "lodash-es";
import { supabase } from "../../lib/supabase";
import type { Profile, ProfileReview } from "./types";

// Every profile query starts with this key, so saving a review or switching users refreshes them all.
export const PROFILE_QUERY_KEY = ["profile"];

type ProfileRow = {
  username: string;
  display_name: string;
  avatar_url: string | null;
  is_own: boolean | null;
};

type ProfileReviewRow = {
  game_id: number;
  game_name: string;
  cover_url: string | null;
  release_year: number | null;
  rating: number;
  body: string | null;
  created_at: string;
};

// null when nobody has this username.
const fetchProfile = async (username: string): Promise<Profile | null> => {
  // Without generated database types, supabase-js can't know these functions return lists of rows.
  const { data, error }: PostgrestSingleResponse<ProfileRow[] | null> = await supabase.rpc("get_profile", {
    target_username: username,
  });
  if (!isNil(error)) {
    throw error;
  }
  const row = data?.[0];
  return isNil(row)
    ? null
    : { username: row.username, displayName: row.display_name, avatarUrl: row.avatar_url, isOwn: row.is_own === true };
};

const fetchProfileReviews = async (username: string): Promise<ProfileReview[]> => {
  const { data, error }: PostgrestSingleResponse<ProfileReviewRow[] | null> = await supabase.rpc(
    "get_profile_reviews",
    { target_username: username },
  );
  if (!isNil(error)) {
    throw error;
  }
  return (data ?? []).map((row) => ({
    gameId: row.game_id,
    gameName: row.game_name,
    coverUrl: row.cover_url,
    releaseYear: row.release_year,
    rating: row.rating,
    body: row.body,
    createdAt: row.created_at,
  }));
};

// null for anonymous visitors, and briefly for new players until their profile exists.
const fetchOwnUsername = async (): Promise<string | null> => {
  const { data, error }: PostgrestSingleResponse<string | null> = await supabase.rpc("get_own_username");
  if (!isNil(error)) {
    throw error;
  }
  return data;
};

export const profileQueryOptions = (username: string) =>
  queryOptions({
    queryKey: [...PROFILE_QUERY_KEY, username],
    queryFn: () => fetchProfile(username),
  });

export const profileReviewsQueryOptions = (username: string) =>
  queryOptions({
    queryKey: [...PROFILE_QUERY_KEY, username, "reviews"],
    queryFn: () => fetchProfileReviews(username),
  });

// Keyed by user id, so signing in as someone else never shows the previous player's username.
export const ownUsernameQueryOptions = (userId: string) =>
  queryOptions({
    queryKey: [...PROFILE_QUERY_KEY, "own-username", userId],
    queryFn: fetchOwnUsername,
  });
