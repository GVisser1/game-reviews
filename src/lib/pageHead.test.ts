import { describe, expect, it } from "vite-plus/test";
import { pageHead, toPageTitle } from "./pageHead";

describe("toPageTitle", () => {
  it("returns the site name without a page name", () => {
    expect(toPageTitle()).toBe("Game Reviews");
  });

  it("puts the page name before the site name", () => {
    expect(toPageTitle("Portal 2")).toBe("Portal 2 - Game Reviews");
  });
});

describe("pageHead", () => {
  it("sets the tab title and the link preview title", () => {
    expect(pageHead("My reviews")).toEqual({
      meta: [{ title: "My reviews - Game Reviews" }, { property: "og:title", content: "My reviews - Game Reviews" }],
    });
  });
});
