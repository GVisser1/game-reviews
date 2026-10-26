import { describe, expect, it } from "vite-plus/test";
import { isLinkPreviewCrawler, parseGameId, toGamePreviewTags } from "./gamePreview";

describe("isLinkPreviewCrawler", () => {
  it.each([
    "Mozilla/5.0 (compatible; Discordbot/2.0; +https://discordapp.com)",
    "Slackbot-LinkExpanding 1.0 (+https://api.slack.com/robots)",
    "WhatsApp/2.23.20.0",
    "facebookexternalhit/1.1;line-poker/1.0",
    "Twitterbot/1.0",
    "TelegramBot (like TwitterBot)",
  ])("recognizes %s", (userAgent) => {
    expect(isLinkPreviewCrawler(userAgent)).toBe(true);
  });

  it("leaves regular browsers alone", () => {
    expect(
      isLinkPreviewCrawler(
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Safari/605.1.15",
      ),
    ).toBe(false);
  });

  it("leaves requests without a user agent alone", () => {
    expect(isLinkPreviewCrawler(null)).toBe(false);
  });
});

describe("parseGameId", () => {
  it("parses a positive whole number", () => {
    expect(parseGameId("72")).toBe(72);
  });

  it.each(["abc", "0", "-1", "1.5", ""])("rejects %j", (value) => {
    expect(parseGameId(value)).toBeNull();
  });
});

describe("toGamePreviewTags", () => {
  it("uses the game's name, summary and cover", () => {
    expect(
      toGamePreviewTags({
        name: "Portal 2",
        summary: "Think with portals.",
        coverUrl: "https://images.igdb.com/a.jpg",
      }),
    ).toEqual({
      title: "Portal 2 - Game Reviews",
      description: "Think with portals.",
      imageUrl: "https://images.igdb.com/a.jpg",
    });
  });

  it("shortens a long summary at a word boundary", () => {
    const { description } = toGamePreviewTags({ name: "Long", summary: "word ".repeat(100), coverUrl: null });

    expect(description.length).toBeLessThanOrEqual(200);
    expect(description).toMatch(/word\.\.\.$/);
  });

  it("falls back to the site description without a summary", () => {
    expect(toGamePreviewTags({ name: "Unknown", summary: null, coverUrl: null })).toEqual({
      title: "Unknown - Game Reviews",
      description: "Find any game, rate it, and keep track of everything you've played.",
      imageUrl: null,
    });
  });
});
