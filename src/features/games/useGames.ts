import { useInfiniteQuery } from "@tanstack/react-query";
import { isNil } from "lodash-es";
import { useCallback } from "react";
import { supabase } from "../../lib/supabase";
import { toFunctionError } from "../../lib/toFunctionError";
import type { Game } from "./types";

const FIRST_OFFSET = 0;

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

const fetchGamesPage = async (search: string, offset: number): Promise<GamesPage> => {
  const { data, error } = await supabase.functions.invoke<GamesPage>("igdb-games", {
    body: { search, offset },
  });
  if (!isNil(error)) {
    throw await toFunctionError(error);
  }
  return data ?? { games: [], nextOffset: null };
};

export const useGames = (search: string): GamesState => {
  const { data, isPending, isFetchingNextPage, hasNextPage, fetchNextPage, error } = useInfiniteQuery({
    queryKey: ["games", search],
    queryFn: ({ pageParam }) => fetchGamesPage(search, pageParam),
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
