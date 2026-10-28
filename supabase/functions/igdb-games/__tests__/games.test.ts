import { describe, expect, it } from "vite-plus/test";
import {
  buildQuery,
  MAX_SEARCH_LENGTH,
  MIN_POPULAR_RATING_COUNT,
  MIN_SEARCH_HYPES,
  MIN_SEARCH_RATING_COUNT,
  PAGE_SIZE,
  parseGamesRequest,
  sanitizeSearch,
  toGame,
  toGamesPage,
} from "../games.ts";
import type { IgdbGame } from "../games.ts";

const FIRST_OFFSET = 0;
const SECOND_PAGE_OFFSET = 50;
const OFFICIAL_TYPES = "game_type = (0,1,2,4,8,9,10)";
const NO_EDITIONS = "version_parent = null";
const HAS_STUDIO = "involved_companies != null";

const createIgdbGames = (count: number): IgdbGame[] =>
  Array.from({ length: count }, (_, index) => ({ id: index + 1, name: `Game ${index + 1}` }));

describe("buildQuery without a search", () => {
  const query = buildQuery("", SECOND_PAGE_OFFSET);

  it("lists popular official games, most-rated first", () => {
    expect(query).toContain(OFFICIAL_TYPES);
    expect(query).toContain(NO_EDITIONS);
    expect(query).toContain(`total_rating_count > ${MIN_POPULAR_RATING_COUNT}`);
    expect(query).toContain("sort total_rating_count desc;");
  });

  it("doesn't filter on names", () => {
    expect(query).not.toContain("name ~");
  });

  it("paginates", () => {
    expect(query).toContain(`limit ${PAGE_SIZE}; offset ${SECOND_PAGE_OFFSET};`);
  });
});

describe("buildQuery with a search", () => {
  const query = buildQuery("elder scr", FIRST_OFFSET);

  it("matches the search at the start of the name or of any word in it", () => {
    expect(query).toContain('name ~ "elder scr"*');
    expect(query).toContain('name ~ *" elder scr"*');
  });

  it("doesn't match the search inside a word", () => {
    expect(query).not.toContain('name ~ *"elder scr"*');
  });

  it("matches alternative names only as the whole name or the first word", () => {
    expect(query).toContain('alternative_names.name ~ "elder scr" |');
    expect(query).toContain('alternative_names.name ~ "elder scr "*');
    expect(query).toContain('alternative_names.name ~ "elder scr:"*');
    expect(query).not.toContain('alternative_names.name ~ *"elder scr"*');
  });

  it("only returns official game types and no separate editions", () => {
    expect(query).toContain(OFFICIAL_TYPES);
    expect(query).toContain(NO_EDITIONS);
  });

  it("lets released games through on ratings", () => {
    expect(query).toContain(`total_rating_count >= ${MIN_SEARCH_RATING_COUNT}`);
  });

  it("only lets unreleased games through on hype when they list a studio", () => {
    expect(query).toContain(`(hypes >= ${MIN_SEARCH_HYPES} & ${HAS_STUDIO})`);
  });

  it("lets DLC and expansions through without ratings or a studio", () => {
    expect(query).toContain("game_type = (1,2)");
  });

  it("requires a studio for standalone expansions", () => {
    expect(query).toContain(`(game_type = 4 & ${HAS_STUDIO})`);
  });

  it("sorts by number of ratings, since IGDB doesn't rank name filters by relevance", () => {
    expect(query).toContain("sort total_rating_count desc;");
  });
});

describe("buildQuery with a sort", () => {
  it("sorts by oldest and leaves out games without a release date", () => {
    for (const search of ["", "zelda"]) {
      const query = buildQuery(search, FIRST_OFFSET, "oldest");
      expect(query).toContain("sort first_release_date asc;");
      expect(query).toContain("& first_release_date != null;");
    }
  });

  it("sorts by name without leaving any games out", () => {
    const query = buildQuery("zelda", FIRST_OFFSET, "name-asc");
    // The search filters end the where clause; nothing is added after them.
    expect(query).toContain(`${HAS_STUDIO})); sort name asc;`);
  });

  it("sorts by newest and only lists games that are already out", () => {
    const now = 1793000000;
    for (const search of ["", "zelda"]) {
      const query = buildQuery(search, FIRST_OFFSET, "newest", now);
      expect(query).toContain("sort first_release_date desc;");
      expect(query).toContain(`& first_release_date != null & first_release_date <= ${now};`);
    }
  });

  it("includes recent releases with only a few ratings when browsing by newest", () => {
    const query = buildQuery("", FIRST_OFFSET, "newest");
    expect(query).not.toContain(`total_rating_count > ${MIN_POPULAR_RATING_COUNT}`);
    expect(query).toContain(
      `(total_rating_count >= ${MIN_SEARCH_RATING_COUNT} | (hypes >= ${MIN_SEARCH_HYPES} & ${HAS_STUDIO}))`,
    );
  });

  it("keeps the well-known games filter when browsing by the other sorts", () => {
    for (const sort of ["popular", "oldest", "name-asc", "name-desc"] as const) {
      expect(buildQuery("", FIRST_OFFSET, sort)).toContain(`total_rating_count > ${MIN_POPULAR_RATING_COUNT}`);
    }
  });

  it("sorts by name in reverse for Z–A", () => {
    expect(buildQuery("", FIRST_OFFSET, "name-desc")).toContain("sort name desc;");
  });

  it("keeps the search filters whatever the sort", () => {
    expect(buildQuery("zelda", FIRST_OFFSET, "name-asc")).toContain(`total_rating_count >= ${MIN_SEARCH_RATING_COUNT}`);
  });
});

describe("sanitizeSearch", () => {
  it("removes quotes and backslashes so the search can't break out of the query string", () => {
    expect(sanitizeSearch('gta" | name ~ *"\\')).toBe("gta | name ~ *");
  });

  it("trims whitespace", () => {
    expect(sanitizeSearch("  zelda  ")).toBe("zelda");
  });

  it("caps the length", () => {
    expect(sanitizeSearch("a".repeat(MAX_SEARCH_LENGTH + 1))).toHaveLength(MAX_SEARCH_LENGTH);
  });
});

describe("parseGamesRequest", () => {
  it("reads a valid search and offset", () => {
    expect(parseGamesRequest({ search: " gta ", offset: SECOND_PAGE_OFFSET })).toEqual({
      search: "gta",
      offset: SECOND_PAGE_OFFSET,
      sort: "popular",
    });
  });

  it("reads a known sort", () => {
    expect(parseGamesRequest({ search: "", offset: FIRST_OFFSET, sort: "newest" }).sort).toBe("newest");
  });

  it.each(["random", 3, "toString", null, "rating"])("falls back to the most popular first for sort %j", (sort) => {
    expect(parseGamesRequest({ sort }).sort).toBe("popular");
  });

  it.each([null, "text", { search: 42, offset: "50" }, { offset: -1 }, { offset: 1.5 }])(
    "falls back to an empty search on the first page for %j",
    (body) => {
      expect(parseGamesRequest(body)).toEqual({ search: "", offset: FIRST_OFFSET, sort: "popular" });
    },
  );
});

describe("toGamesPage", () => {
  it("points to the next page when IGDB returned a full page", () => {
    expect(toGamesPage(createIgdbGames(PAGE_SIZE), SECOND_PAGE_OFFSET).nextOffset).toBe(SECOND_PAGE_OFFSET + PAGE_SIZE);
  });

  it("has no next page when IGDB returned fewer games", () => {
    expect(toGamesPage(createIgdbGames(PAGE_SIZE - 1), SECOND_PAGE_OFFSET).nextOffset).toBeNull();
  });
});

describe("toGame", () => {
  it("builds the cover URL and release year", () => {
    const gtaVReleaseDate = 1379376000;
    expect(
      toGame({
        id: 1020,
        name: "Grand Theft Auto V",
        cover: { image_id: "co2lbd" },
        first_release_date: gtaVReleaseDate,
      }),
    ).toEqual({
      id: 1020,
      name: "Grand Theft Auto V",
      coverUrl: "https://images.igdb.com/igdb/image/upload/t_cover_big/co2lbd.jpg",
      releaseYear: 2013,
    });
  });

  it("leaves out a missing cover and release date", () => {
    expect(toGame({ id: 1, name: "Unannounced" })).toMatchObject({ coverUrl: null, releaseYear: null });
  });
});
