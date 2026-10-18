import type { PostgrestSingleResponse } from "@supabase/supabase-js";
import { queryOptions } from "@tanstack/react-query";
import { isNil } from "lodash-es";
import { supabase } from "../../lib/supabase";
import type { RatingSummary } from "./types";

export const RATING_SUMMARY_QUERY_KEY = ["game-rating-summary"];

type RatingSummaryRow = {
  average_rating: number | string | null;
  rating_count: number;
};

const fetchRatingSummary = async (gameId: number): Promise<RatingSummary> => {
  // Without generated database types, supabase-js can't know this function returns a list of rows.
  const { data, error }: PostgrestSingleResponse<RatingSummaryRow[] | null> = await supabase.rpc(
    "get_game_rating_summary",
    { target_game_id: gameId },
  );
  if (!isNil(error)) {
    throw error;
  }
  const row = data?.[0];
  return {
    // Postgres numerics can arrive as strings.
    averageRating: isNil(row?.average_rating) ? null : Number(row.average_rating),
    ratingCount: row?.rating_count ?? 0,
  };
};

export const ratingSummaryQueryOptions = (gameId: number) =>
  queryOptions({
    queryKey: [...RATING_SUMMARY_QUERY_KEY, gameId],
    queryFn: () => fetchRatingSummary(gameId),
  });
