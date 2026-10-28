import { describe, expect, it } from "vite-plus/test";
import { normalizeReviewBody } from "../reviewBody";

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
