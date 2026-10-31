// @vitest-environment jsdom
import { createMemoryHistory, createRootRoute, createRouter, RouterContextProvider } from "@tanstack/react-router";
import { cleanup, render } from "@testing-library/react";
import { uniq } from "lodash-es";
import { afterEach, beforeAll, describe, expect, it, vi } from "vite-plus/test";
import { DOCS_PAGES } from "../docsRegistry";
import { MDX_COMPONENTS } from "../mdxComponents";
import { DOCS_GROUPS } from "../utils/docsUtil";

// Some demos render links, which need a router.
const router = createRouter({ routeTree: createRootRoute(), history: createMemoryHistory() });

beforeAll(async () => {
  await router.load();
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

// MDX turns text on its own line inside JSX into a paragraph, like `<h1><p>Title</p></h1>`, which React doesn't warn
// about.
const PARAGRAPH_IN_INLINE_ELEMENT = ":is(h1, h2, h3, h4, h5, h6, a, button, span, label) p";

// The docs pages' examples are plain JSX in MDX, which nothing type checks. Rendering each page catches broken imports,
// examples that throw or that React warns about, and text that MDX wrapped in a paragraph.
describe("docs pages", () => {
  it("finds the pages", () => {
    expect(DOCS_PAGES.length).toBeGreaterThan(0);
  });

  // The frontmatter isn't type checked either, and a page with an unknown group is left out of the sidebar.
  it.each(DOCS_PAGES)("has a title, a description and a known group for $slug", (page) => {
    expect(page.title).toEqual(expect.any(String));
    expect(page.description).toEqual(expect.any(String));
    expect(DOCS_GROUPS).toContain(page.group);
  });

  // The address comes from the file name, so two pages with the same name in different folders would share one.
  it("gives every page its own address", () => {
    const slugs = DOCS_PAGES.map((page) => page.slug);
    expect(slugs).toEqual(uniq(slugs));
  });

  it.each(DOCS_PAGES)("renders $title without errors or warnings", ({ Content }) => {
    const consoleError = vi.spyOn(console, "error");

    const { container } = render(
      <RouterContextProvider router={router}>
        <Content components={MDX_COMPONENTS} />
      </RouterContextProvider>,
    );

    expect(container.textContent).not.toBe("");
    expect(consoleError).not.toHaveBeenCalled();
    expect(container.querySelector(PARAGRAPH_IN_INLINE_ELEMENT)).toBeNull();
  });
});
