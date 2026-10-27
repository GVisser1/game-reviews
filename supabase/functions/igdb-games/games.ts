import { toCoverUrl, toReleaseYear } from "../_shared/format.ts";

export const PAGE_SIZE = 50;
const MS_PER_SECOND = 1000;
export const MIN_POPULAR_RATING_COUNT = 10;
export const MAX_SEARCH_LENGTH = 100;
const GAME_FIELDS = "fields name, cover.image_id, first_release_date;";

// IGDB game types: main game, DLC/add-on, expansion, standalone expansion, remake, remaster, expanded game.
// Leaves out mods, bundles, ports, packs, episodes and updates, which flood search with fan-made and duplicate entries.
const OFFICIAL_GAME_TYPES = [0, 1, 2, 4, 8, 9, 10];
// Editions (Special, Complete, GOTY...) point to their original via version_parent, so this keeps only the original.
const OFFICIAL_GAMES_FILTER = `cover != null & game_type = (${OFFICIAL_GAME_TYPES.join(",")}) & version_parent = null`;
// Fan games and shovelware that match the search text usually have no ratings; hype keeps unreleased games.
// A single rating isn't enough: obscure shareware and fan games often have one or two.
export const MIN_SEARCH_RATING_COUNT = 5;
export const MIN_SEARCH_HYPES = 5;
// Unreleased official games always list a developer or publisher; hyped fan projects like GtaGuessr list none.
// Standalone expansions need one too (catches fan games like "Five Nights at Sonic's").
const HAS_STUDIO = "involved_companies != null";
// DLC and expansions skip the rating and studio checks: IGDB rarely lists studios or ratings for official add-ons.
const ADD_ON_GAME_TYPES = [1, 2];
const STANDALONE_EXPANSION_GAME_TYPE = 4;
const KNOWN_GAMES_FILTER = [
  `total_rating_count >= ${MIN_SEARCH_RATING_COUNT}`,
  `(hypes >= ${MIN_SEARCH_HYPES} & ${HAS_STUDIO})`,
  `game_type = (${ADD_ON_GAME_TYPES.join(",")})`,
  `(game_type = ${STANDALONE_EXPANSION_GAME_TYPE} & ${HAS_STUDIO})`,
].join(" | ");
// Recent releases haven't collected many ratings yet, so browsing by newest can't require as many as the popular list.
// Unlike KNOWN_GAMES_FILTER it doesn't let every add-on through: without a search, small DLC would flood the list.
const RECENT_GAMES_FILTER = [
  `total_rating_count >= ${MIN_SEARCH_RATING_COUNT}`,
  `(hypes >= ${MIN_SEARCH_HYPES} & ${HAS_STUDIO})`,
].join(" | ");

// How the list is ordered. IGDB sorts on one field only, so each option is a single field and direction. Games without
// that field (no rating yet, no release date) would sort first or last at random, so those options leave them out.
export const GAMES_SORTS = ["popular", "rating", "newest", "oldest", "name-asc", "name-desc"] as const;
export type GamesSort = (typeof GAMES_SORTS)[number];
export const DEFAULT_SORT: GamesSort = "popular";

type SortOption = {
  sort: string;
  filter?: (nowSeconds: number) => string;
  // Without a search, show recent games with only a few ratings instead of just the well-known ones.
  includesRecentGames?: boolean;
};

const SORTS: Record<GamesSort, SortOption> = {
  popular: { sort: "total_rating_count desc" },
  rating: { sort: "total_rating desc", filter: () => "total_rating != null" },
  // Only games that are out: upcoming ones have (often placeholder) future dates and would fill the top.
  newest: {
    sort: "first_release_date desc",
    filter: (nowSeconds) => `first_release_date != null & first_release_date <= ${nowSeconds}`,
    includesRecentGames: true,
  },
  oldest: { sort: "first_release_date asc", filter: () => "first_release_date != null" },
  "name-asc": { sort: "name asc" },
  "name-desc": { sort: "name desc" },
};

const isGamesSort = (value: unknown): value is GamesSort => GAMES_SORTS.includes(value as GamesSort);

export type IgdbGame = {
  id: number;
  name: string;
  cover?: { image_id: string };
  first_release_date?: number;
};

export type Game = {
  id: number;
  name: string;
  coverUrl: string | null;
  releaseYear: number | null;
};

export type GamesPage = {
  games: Game[];
  nextOffset: number | null;
};

export const toGame = (igdbGame: IgdbGame): Game => ({
  id: igdbGame.id,
  name: igdbGame.name,
  coverUrl: toCoverUrl(igdbGame.cover),
  releaseYear: toReleaseYear(igdbGame.first_release_date),
});

// Quotes and backslashes would break out of the Apicalypse search string.
export const sanitizeSearch = (search: string): string =>
  search.replace(/["\\]/g, "").trim().slice(0, MAX_SEARCH_LENGTH);

export const buildQuery = (
  search: string,
  offset: number,
  sortName: GamesSort = DEFAULT_SORT,
  nowSeconds = Math.floor(Date.now() / MS_PER_SECOND),
): string => {
  const pagination = `limit ${PAGE_SIZE}; offset ${offset};`;
  const { sort, filter, includesRecentGames } = SORTS[sortName];
  const sortFilter = filter ? ` & ${filter(nowSeconds)}` : "";
  const sortClause = `sort ${sort};`;
  if (search === "") {
    const browseFilter = includesRecentGames
      ? `(${RECENT_GAMES_FILTER})`
      : `total_rating_count > ${MIN_POPULAR_RATING_COUNT}`;
    return `${GAME_FIELDS} where ${OFFICIAL_GAMES_FILTER} & ${browseFilter}${sortFilter}; ${sortClause} ${pagination}`;
  }
  // IGDB's `search` only matches whole words ("elder scr" finds nothing), so match case-insensitively at the start
  // of any word in the name instead ("elder scr" matches "The Elder Scrolls", but "gta" doesn't match
  // "Kinzigtalbahn"), with the most-rated matches first. Alternative names are short abbreviations, so they
  // only match as a whole name or first word ("GTA", "GTA V", "GTA: VCS"); otherwise "gta" would match "GTag".
  const alternativeNameMatches = [`"${search}"`, `"${search} "*`, `"${search}:"*`]
    .map((pattern) => `alternative_names.name ~ ${pattern}`)
    .join(" | ");
  const nameMatches = `(name ~ "${search}"* | name ~ *" ${search}"* | ${alternativeNameMatches})`;
  return `${GAME_FIELDS} where ${nameMatches} & ${OFFICIAL_GAMES_FILTER} & (${KNOWN_GAMES_FILTER})${sortFilter}; ${sortClause} ${pagination}`;
};

type GamesRequest = {
  search: string;
  offset: number;
  sort: GamesSort;
};

export const parseGamesRequest = (body: unknown): GamesRequest => {
  const { search, offset, sort } = (typeof body === "object" && body !== null ? body : {}) as Record<string, unknown>;
  return {
    search: typeof search === "string" ? sanitizeSearch(search) : "",
    offset: typeof offset === "number" && Number.isInteger(offset) && offset >= 0 ? offset : 0,
    sort: isGamesSort(sort) ? sort : DEFAULT_SORT,
  };
};

export const toGamesPage = (igdbGames: IgdbGame[], offset: number): GamesPage => ({
  games: igdbGames.map(toGame),
  nextOffset: igdbGames.length === PAGE_SIZE ? offset + PAGE_SIZE : null,
});
