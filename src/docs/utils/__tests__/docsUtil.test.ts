import { describe, expect, it } from "vite-plus/test";
import { toDocsSlug, toTypeLabel } from "../docsUtil";

describe("toDocsSlug", () => {
  it.each([
    ["/src/shared/__docs__/StarRating.docs.mdx", "star-rating"],
    ["/src/features/auth/__docs__/SignInPrompt.docs.mdx", "sign-in-prompt"],
  ])("turns %s into %s", (path, slug) => {
    expect(toDocsSlug(path)).toBe(slug);
  });
});

describe("toTypeLabel", () => {
  it("shows a function type as written", () => {
    const prop = { tsType: { name: "signature", type: "function", raw: "(rating: number) => void" } } as const;
    expect(toTypeLabel(prop as never)).toBe("(rating: number) => void");
  });

  it("shows a simple type by name", () => {
    expect(toTypeLabel({ tsType: { name: "number" } })).toBe("number");
  });

  it("says unknown without a type", () => {
    expect(toTypeLabel({})).toBe("unknown");
  });
});
