import { describe, expect, it } from "vite-plus/test";
import { formatRatingSummary } from "./formatRatingSummary";

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
