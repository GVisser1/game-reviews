import type { PostgrestSingleResponse } from "@supabase/supabase-js";
import { queryOptions } from "@tanstack/react-query";
import { isNil } from "lodash-es";
import { supabase } from "../../lib/supabase";
import { RATING_SUMMARY_QUERY_KEY, type RatingSummaryRow, toRatingSummary } from "./ratingSummaryQuery";
import type { TopRatedGame } from "./types";

// One player's 5 stars shouldn't put a game at the top.
export const MIN_TOP_RATED_RATINGS = 2;
const MAX_TOP_RATED_GAMES = 50;

type TopRatedGameRow = RatingSummaryRow & {
  game_id: number;
  game_name: string;
  cover_url: string | null;
};

const fetchTopRatedGames = async (): Promise<TopRatedGame[]> => {
  const { data, error }: PostgrestSingleResponse<TopRatedGameRow[] | null> = await supabase.rpc("get_top_rated_games", {
    min_ratings: MIN_TOP_RATED_RATINGS,
    max_games: MAX_TOP_RATED_GAMES,
  });
  if (!isNil(error)) {
    throw error;
  }
  return (data ?? []).map((row) => ({
    gameId: row.game_id,
    gameName: row.game_name,
    coverUrl: row.cover_url,
    ratingSummary: toRatingSummary(row),
  }));
};

export const topRatedGamesQueryOptions = queryOptions({
  queryKey: [...RATING_SUMMARY_QUERY_KEY, "top-rated"],
  queryFn: fetchTopRatedGames,
});
