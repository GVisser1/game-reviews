import { describe, expect, it } from "vite-plus/test";
import { toPreviewSlug } from "../previewUtil";

describe("toPreviewSlug", () => {
  it.each([
    ["/src/shared/__previews__/StarRating.preview.tsx", "star-rating"],
    ["/src/features/auth/__previews__/SignInPrompt.preview.tsx", "sign-in-prompt"],
    ["/src/features/dev/previews/Colors.preview.tsx", "colors"],
  ])("turns %s into %s", (path, slug) => {
    expect(toPreviewSlug(path)).toBe(slug);
  });
});
