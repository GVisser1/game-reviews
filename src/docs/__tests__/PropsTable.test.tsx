// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import type { Documentation } from "react-docgen";
import { afterEach, describe, expect, it, vi } from "vite-plus/test";
import { PropsTable } from "../PropsTable";

const DOCS: Documentation[] = [
  { displayName: "First", props: { rating: { required: true, tsType: { name: "number" }, description: "" } } },
  { displayName: "Second", props: { name: { required: false, tsType: { name: "string" }, description: "" } } },
];

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("PropsTable", () => {
  it("shows the file's first component by default", () => {
    render(<PropsTable docs={DOCS} />);

    expect(screen.getByRole("cell", { name: /^rating/ })).toBeDefined();
  });

  it("shows the component it's asked for", () => {
    render(<PropsTable docs={DOCS} component="Second" />);

    expect(screen.getByRole("cell", { name: "name" })).toBeDefined();
  });

  it("throws for a component the file doesn't have", () => {
    // React logs the error it rethrows.
    vi.spyOn(console, "error").mockImplementation(() => undefined);

    expect(() => render(<PropsTable docs={DOCS} component="Thrid" />)).toThrow(
      `There's no component called "Thrid" in this file`,
    );
  });
});
