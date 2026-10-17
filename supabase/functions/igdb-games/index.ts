import { handleRequest, queryIgdb } from "../_shared/igdb.ts";
import { buildQuery, parseGamesRequest, toGamesPage } from "./games.ts";
import type { GamesPage, IgdbGame } from "./games.ts";

Deno.serve(
  handleRequest(async (request): Promise<GamesPage> => {
    const { search, offset } = parseGamesRequest(await request.json().catch(() => ({})));
    const igdbGames = await queryIgdb<IgdbGame>("games", buildQuery(search, offset));
    return toGamesPage(igdbGames, offset);
  }),
);
