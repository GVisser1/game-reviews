import { describe, expect, it } from "vite-plus/test";
import { parseGameId, validateGamesSearch } from "./routeParams";

describe("parseGameId", () => {
  it("parses a numeric game id", () => {
    expect(parseGameId("72")).toBe(72);
  });

  it.each(["abc", "0", "-5", "1.5", ""])("rejects %j", (gameId) => {
    expect(() => parseGameId(gameId)).toThrow("Invalid game id");
  });
});

describe("validateGamesSearch", () => {
  it("keeps a search term", () => {
    expect(validateGamesSearch({ q: "zelda" })).toEqual({ q: "zelda" });
  });

  it("drops an empty search term", () => {
    expect(validateGamesSearch({ q: "" })).toEqual({ q: undefined });
  });

  it("drops a missing or unexpected search term", () => {
    expect(validateGamesSearch({})).toEqual({ q: undefined });
    expect(validateGamesSearch({ q: { nested: true } })).toEqual({ q: undefined });
  });

  it("turns a numeric search back into text", () => {
    expect(validateGamesSearch({ q: 1942 })).toEqual({ q: "1942" });
  });
});
