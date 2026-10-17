export type GamesSearch = {
  q?: string;
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
  const { q } = search;
  if (typeof q === "number") {
    return { q: String(q) };
  }
  return { q: typeof q === "string" && q !== "" ? q : undefined };
};
