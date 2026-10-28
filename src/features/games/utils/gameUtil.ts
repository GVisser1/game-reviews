// The igdb-games edge function accepts the same values and turns them into IGDB sort clauses.
export const GAMES_SORT_OPTIONS = [
  { value: "popular", label: "Most popular" },
  { value: "rating", label: "Highest rated" },
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "name-asc", label: "Name A–Z" },
  { value: "name-desc", label: "Name Z–A" },
] as const;

export type GamesSort = (typeof GAMES_SORT_OPTIONS)[number]["value"];

export const DEFAULT_GAMES_SORT: GamesSort = "popular";

export type GamesSearch = {
  q?: string;
  // Left out of the URL for the default, most popular first.
  sort?: GamesSort;
};

export const isGamesSort = (value: unknown): value is GamesSort =>
  GAMES_SORT_OPTIONS.some((option) => option.value === value);

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
