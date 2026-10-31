import { describe, expect, it } from "vite-plus/test";
import { parseDesignTokens, toContrastRatio, toContrastResults, toHue, toPixels } from "../tokenUtil";

const CSS = `
@theme {
  --text-*: initial;
  --text-title: 1.875rem;
  --text-title--line-height: 2.25rem;
  --text-title--font-weight: 700;
  --text-body: 1rem; /* A comment; with a semicolon. */
  --text-body--line-height: 1.5rem;
}

:root {
  --white: #FFFFFF;
  --gray-50: #f9fafb;
  --gray-900: #111827;
  --page: light-dark(var(--gray-50), var(--gray-900));
  --on-danger: var(--white);
}

@theme inline {
  --color-page: var(--page);
  --color-on-danger: var(--on-danger);
}

:root[data-theme="dark"] {
  --gray-50: #000000;
}
`;

describe("parseDesignTokens", () => {
  const tokens = parseDesignTokens(CSS);

  it("finds the palette in the plain :root block", () => {
    expect(tokens.palette).toEqual([
      { name: "white", hex: "#ffffff" },
      { name: "gray-50", hex: "#f9fafb" },
      { name: "gray-900", hex: "#111827" },
    ]);
  });

  it("resolves each colour role's light and dark shade", () => {
    expect(tokens.colorRoles).toEqual([
      { name: "page", light: { name: "gray-50", hex: "#f9fafb" }, dark: { name: "gray-900", hex: "#111827" } },
      { name: "on-danger", light: { name: "white", hex: "#ffffff" }, dark: { name: "white", hex: "#ffffff" } },
    ]);
  });

  it("reads the text roles with their line height, weight and tracking", () => {
    expect(tokens.textRoles).toEqual([
      { name: "title", fontSize: "1.875rem", lineHeight: "2.25rem", fontWeight: "700", letterSpacing: undefined },
      { name: "body", fontSize: "1rem", lineHeight: "1.5rem", fontWeight: undefined, letterSpacing: undefined },
    ]);
  });

  it("fails on a role that doesn't use a palette colour", () => {
    const css = ":root { --page: #fff; } @theme inline { --color-page: var(--page); }";
    expect(() => parseDesignTokens(css)).toThrow(`"#fff" isn't a palette colour`);
  });

  it("fails on a colour that isn't a role", () => {
    const css = ":root { --violet: #7c3aed; } @theme inline { --color-brand: #7c3aed; }";
    expect(() => parseDesignTokens(css)).toThrow(
      `--color-brand should point at a role, like var(--brand), not "#7c3aed"`,
    );
  });

  it("fails on a role outside the plain :root block", () => {
    const css = ":root, :host { --page: #ffffff; } @theme inline { --color-page: var(--page); }";
    expect(() => parseDesignTokens(css)).toThrow("--color-page uses --page, which isn't in the plain :root block");
  });

  it("fails on a text role without a line height", () => {
    expect(() => parseDesignTokens("@theme { --text-body: 1rem; }")).toThrow("--text-body has no line height");
  });
});

describe("toContrastRatio", () => {
  it.each([
    ["#000000", "#ffffff", 21],
    ["#ffffff", "#000000", 21],
    ["#777777", "#777777", 1],
    ["#767676", "#ffffff", 4.54],
  ])("gives %s on %s a ratio of %d", (first, second, ratio) => {
    expect(toContrastRatio(first, second)).toBeCloseTo(ratio, 2);
  });
});

describe("toContrastResults", () => {
  it("gives a pair's contrast in both modes", () => {
    const [result] = toContrastResults(parseDesignTokens(CSS), [
      { foreground: "on-danger", background: "page", minimum: 4.5 },
    ]);
    expect(result.light.passes).toBe(false);
    expect(result.dark).toMatchObject({ foregroundHex: "#ffffff", backgroundHex: "#111827", passes: true });
  });

  it("fails on a role that doesn't exist", () => {
    expect(() =>
      toContrastResults(parseDesignTokens(CSS), [{ foreground: "nope", background: "page", minimum: 3 }]),
    ).toThrow(`There's no colour role called "nope"`);
  });
});

describe("toPixels", () => {
  it.each([
    ["3rem", "48px"],
    ["0.875rem", "14px"],
    ["-0.02em", "-0.02em"],
  ])("turns %s into %s", (size, pixels) => {
    expect(toPixels(size)).toBe(pixels);
  });
});

describe("toHue", () => {
  it.each([
    ["gray-700", "gray"],
    ["white", "white"],
  ])("turns %s into %s", (name, hue) => {
    expect(toHue(name)).toBe(hue);
  });
});
