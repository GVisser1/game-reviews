import type { PostgrestSingleResponse } from "@supabase/supabase-js";
import { queryOptions } from "@tanstack/react-query";
import { isNil } from "lodash-es";
import { supabase } from "../../lib/supabase";
import type { GameReview } from "./types";

export const GAME_REVIEWS_QUERY_KEY = ["game-reviews"];

type GameReviewRow = {
  username: string;
  display_name: string;
  avatar_url: string | null;
  rating: number;
  body: string;
  created_at: string;
  is_own: boolean;
};

const toGameReview = (row: GameReviewRow): GameReview => ({
  username: row.username,
  displayName: row.display_name,
  avatarUrl: row.avatar_url,
  rating: row.rating,
  body: row.body,
  createdAt: row.created_at,
  isOwn: row.is_own,
});

const fetchGameReviews = async (gameId: number): Promise<GameReview[]> => {
  // Without generated database types, supabase-js can't know this function returns a list of rows.
  const { data, error }: PostgrestSingleResponse<GameReviewRow[] | null> = await supabase.rpc("get_game_reviews", {
    target_game_id: gameId,
  });
  if (!isNil(error)) {
    throw error;
  }
  return (data ?? []).map(toGameReview);
};

export const gameReviewsQueryOptions = (gameId: number) =>
  queryOptions({
    queryKey: [...GAME_REVIEWS_QUERY_KEY, gameId],
    queryFn: () => fetchGameReviews(gameId),
  });
