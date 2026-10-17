import { toCoverUrl, toReleaseYear } from "../_shared/format.ts";
import { handleRequest, queryIgdb } from "../_shared/igdb.ts";

const DETAIL_FIELDS =
  "fields name, summary, cover.image_id, first_release_date, genres.name, platforms.name, total_rating;";

type NamedEntity = { name: string };

type IgdbGameDetails = {
  id: number;
  name: string;
  summary?: string;
  cover?: { image_id: string };
  first_release_date?: number;
  genres?: NamedEntity[];
  platforms?: NamedEntity[];
  total_rating?: number;
};

type GameDetails = {
  id: number;
  name: string;
  summary: string | null;
  coverUrl: string | null;
  releaseYear: number | null;
  genres: string[];
  platforms: string[];
  igdbRating: number | null;
};

const toNames = (entities?: NamedEntity[]): string[] => (entities ?? []).map(({ name }) => name);

const toGameDetails = (game: IgdbGameDetails): GameDetails => ({
  id: game.id,
  name: game.name,
  summary: game.summary ?? null,
  coverUrl: toCoverUrl(game.cover),
  releaseYear: toReleaseYear(game.first_release_date),
  genres: toNames(game.genres),
  platforms: toNames(game.platforms),
  igdbRating: game.total_rating ? Math.round(game.total_rating) : null,
});

Deno.serve(
  handleRequest(async (request): Promise<GameDetails> => {
    const { id } = await request.json().catch(() => ({}));
    if (typeof id !== "number" || !Number.isInteger(id) || id <= 0) {
      throw new Error("A valid game id is required");
    }

    const [game] = await queryIgdb<IgdbGameDetails>("games", `${DETAIL_FIELDS} where id = ${id};`);
    if (game === undefined) {
      throw new Error(`Game ${id} not found`);
    }
    return toGameDetails(game);
  }),
);
