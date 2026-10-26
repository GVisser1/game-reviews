import { DEFAULT_GAMES_SORT, type GamesSort, isGamesSort } from "./gamesSort";

export type GamesSearch = {
  q?: string;
  // Left out of the URL for the default, most popular first.
  sort?: GamesSort;
};

export const parseGameId = (gameId: string): number => {
  const parsedGameId = Number(gameId);
  if (!Number.isInteger(parsedGameId) || parsedGameId <= 0) {
    throw new Error("Invalid game id");
  }
  return parsedGameId;
};

// TanStack Router parses search values as JSON, so a hand-typed "?q=1942" arrives as a number.
export const validateGamesSearch = (search: Record<string, unknown>): GamesSearch => {
  const { q, sort } = search;
  return {
    q: typeof q === "number" ? String(q) : typeof q === "string" && q !== "" ? q : undefined,
    sort: isGamesSort(sort) && sort !== DEFAULT_GAMES_SORT ? sort : undefined,
  };
};
