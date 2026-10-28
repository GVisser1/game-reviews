import type { PostgrestSingleResponse } from "@supabase/supabase-js";
import { useInfiniteQuery } from "@tanstack/react-query";
import { isNil } from "lodash-es";
import { useCallback } from "react";
import { supabase } from "../../lib/supabase";
import { toFunctionError } from "../../utils/errorUtil";
import { RATING_SUMMARY_QUERY_KEY } from "../reviews/ratingSummaryQuery";
import type { Game } from "./types";
import type { GamesSort } from "./utils/gameUtil";

const FIRST_OFFSET = 0;
const RATED_GAMES_PAGE_SIZE = 50;

type GamesPage = {
  games: Game[];
  nextOffset: number | null;
};

type GamesState = {
  games: Game[];
  // The ids of each loaded page, so data fetched per page (like rating summaries) doesn't refetch earlier pages.
  gameIdsByPage: number[][];
  isLoading: boolean;
  hasMore: boolean;
  error: string | null;
  loadMore: () => void;
};

type RatedGameRow = {
  game_id: number;
  game_name: string;
  cover_url: string | null;
  release_year: number | null;
};

// "Highest rated" uses this site's community ratings, which live in Supabase rather than IGDB.
const fetchRatedGamesPage = async (search: string, offset: number): Promise<GamesPage> => {
  // Without generated database types, supabase-js can't know this function returns a list of rows.
  const { data, error }: PostgrestSingleResponse<RatedGameRow[] | null> = await supabase.rpc("get_rated_games", {
    search_text: search,
    page_offset: offset,
    page_size: RATED_GAMES_PAGE_SIZE,
  });
  if (!isNil(error)) {
    throw error;
  }
  const rows = data ?? [];
  return {
    games: rows.map((row) => ({
      id: row.game_id,
      name: row.game_name,
      coverUrl: row.cover_url,
      releaseYear: row.release_year,
    })),
    nextOffset: rows.length === RATED_GAMES_PAGE_SIZE ? offset + RATED_GAMES_PAGE_SIZE : null,
  };
};

const fetchGamesPage = async (search: string, sort: GamesSort, offset: number): Promise<GamesPage> => {
  const { data, error } = await supabase.functions.invoke<GamesPage>("igdb-games", {
    body: { search, sort, offset },
  });
  if (!isNil(error)) {
    throw await toFunctionError(error);
  }
  return data ?? { games: [], nextOffset: null };
};

export const useGames = (search: string, sort: GamesSort): GamesState => {
  const isByCommunityRating = sort === "rating";
  const { data, isPending, isFetchingNextPage, hasNextPage, fetchNextPage, error } = useInfiniteQuery({
    // Under the rating summary key, so saving or removing a review refreshes the community-rated list too.
    queryKey: isByCommunityRating ? [...RATING_SUMMARY_QUERY_KEY, "games", search] : ["games", search, sort],
    queryFn: ({ pageParam }) =>
      isByCommunityRating ? fetchRatedGamesPage(search, pageParam) : fetchGamesPage(search, sort, pageParam),
    initialPageParam: FIRST_OFFSET,
    getNextPageParam: (lastPage) => lastPage.nextOffset ?? undefined,
  });

  const loadMore = useCallback((): void => {
    if (hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return {
    games: data?.pages.flatMap((page) => page.games) ?? [],
    gameIdsByPage: data?.pages.map((page) => page.games.map((game) => game.id)) ?? [],
    isLoading: isPending || isFetchingNextPage,
    hasMore: hasNextPage,
    error: error?.message ?? null,
    loadMore,
  };
};
