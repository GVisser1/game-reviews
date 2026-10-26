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

export const isGamesSort = (value: unknown): value is GamesSort =>
  GAMES_SORT_OPTIONS.some((option) => option.value === value);
