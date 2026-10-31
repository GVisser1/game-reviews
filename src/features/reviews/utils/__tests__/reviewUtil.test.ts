import { describe, expect, it } from "vite-plus/test";
import { formatRatingSummary, formatShortRatingSummary, normalizeReviewBody } from "../reviewUtil";

describe("formatRatingSummary", () => {
  it("shows the average with one decimal and the number of ratings", () => {
    expect(formatRatingSummary({ averageRating: 4.3, ratingCount: 12 })).toBe("4.3/5 from 12 ratings");
  });

  it("keeps the decimal for whole averages", () => {
    expect(formatRatingSummary({ averageRating: 4, ratingCount: 2 })).toBe("4.0/5 from 2 ratings");
  });

  it("uses the singular for one rating", () => {
    expect(formatRatingSummary({ averageRating: 5, ratingCount: 1 })).toBe("5.0/5 from 1 rating");
  });

  it("says when a game has no ratings", () => {
    expect(formatRatingSummary({ averageRating: null, ratingCount: 0 })).toBe("No ratings yet");
  });
});

describe("formatShortRatingSummary", () => {
  it("shows the average and the number of ratings", () => {
    expect(formatShortRatingSummary({ averageRating: 4.3, ratingCount: 12 })).toBe("4.3 (12)");
  });

  it("keeps the decimal for whole averages", () => {
    expect(formatShortRatingSummary({ averageRating: 5, ratingCount: 1 })).toBe("5.0 (1)");
  });

  it("returns nothing for a game without ratings", () => {
    expect(formatShortRatingSummary({ averageRating: null, ratingCount: 0 })).toBeNull();
  });
});

describe("normalizeReviewBody", () => {
  it("trims surrounding whitespace", () => {
    expect(normalizeReviewBody("  Great puzzles.\n")).toBe("Great puzzles.");
  });

  it("keeps line breaks inside the text", () => {
    expect(normalizeReviewBody("Great puzzles.\n\nShort, though.")).toBe("Great puzzles.\n\nShort, though.");
  });

  it.each(["", "   ", "\n\t"])("turns blank text %j into null", (text) => {
    expect(normalizeReviewBody(text)).toBeNull();
  });
});
