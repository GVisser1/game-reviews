import type { PostgrestSingleResponse } from "@supabase/supabase-js";
import { queryOptions } from "@tanstack/react-query";
import { isNil } from "lodash-es";
import { supabase } from "../../lib/supabase";
import type { RatingSummary } from "./types";

// Every rating summary query starts with this key, so saving or removing a review refreshes them all.
export const RATING_SUMMARY_QUERY_KEY = ["game-rating-summary"];

export type RatingSummaryRow = {
  average_rating: number | string | null;
  rating_count: number;
};

type GameRatingSummaryRow = RatingSummaryRow & {
  game_id: number;
};

export const toRatingSummary = (row: RatingSummaryRow | undefined): RatingSummary => ({
  // Postgres numerics can arrive as strings.
  averageRating: isNil(row?.average_rating) ? null : Number(row.average_rating),
  ratingCount: row?.rating_count ?? 0,
});

const fetchRatingSummary = async (gameId: number): Promise<RatingSummary> => {
  // Without generated database types, supabase-js can't know this function returns a list of rows.
  const { data, error }: PostgrestSingleResponse<RatingSummaryRow[] | null> = await supabase.rpc(
    "get_game_rating_summary",
    { target_game_id: gameId },
  );
  if (!isNil(error)) {
    throw error;
  }
  return toRatingSummary(data?.[0]);
};

// Games nobody rated aren't in the map.
const fetchRatingSummaries = async (gameIds: number[]): Promise<Map<number, RatingSummary>> => {
  const { data, error }: PostgrestSingleResponse<GameRatingSummaryRow[] | null> = await supabase.rpc(
    "get_rating_summaries",
    { target_game_ids: gameIds },
  );
  if (!isNil(error)) {
    throw error;
  }
  return new Map((data ?? []).map((row) => [row.game_id, toRatingSummary(row)]));
};

export const ratingSummaryQueryOptions = (gameId: number) =>
  queryOptions({
    queryKey: [...RATING_SUMMARY_QUERY_KEY, gameId],
    queryFn: () => fetchRatingSummary(gameId),
  });

export const ratingSummariesQueryOptions = (gameIds: number[]) =>
  queryOptions({
    queryKey: [...RATING_SUMMARY_QUERY_KEY, "list", gameIds],
    queryFn: () => fetchRatingSummaries(gameIds),
  });
