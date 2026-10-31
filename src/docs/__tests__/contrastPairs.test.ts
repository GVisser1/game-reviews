import { describe, expect, it } from "vite-plus/test";
import { CONTRAST_PAIRS } from "../contrastPairs";
import { DESIGN_TOKENS } from "../designTokens";
import { COLOR_MODES, toContrastResults } from "../utils/tokenUtil";

describe("index.css", () => {
  it("has colour and text roles to document", () => {
    expect(DESIGN_TOKENS.colorRoles.length).toBeGreaterThan(0);
    expect(DESIGN_TOKENS.textRoles.length).toBeGreaterThan(0);
  });

  it.each(
    toContrastResults(DESIGN_TOKENS, CONTRAST_PAIRS).flatMap((result) =>
      COLOR_MODES.map((mode) => ({ ...result, mode })),
    ),
  )("has enough contrast for $foreground on $background in $mode mode", (result) => {
    expect(result[result.mode].ratio).toBeGreaterThanOrEqual(result.minimum);
  });
});
