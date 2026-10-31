import { isNil } from "lodash-es";

export type PaletteColor = { name: string; hex: string };

// A colour role's value in one mode: the palette shade it uses and that shade's hex.
export type ColorValue = PaletteColor;

export type ColorRole = { name: string; light: ColorValue; dark: ColorValue };

export type TextRole = {
  name: string;
  fontSize: string;
  lineHeight: string;
  fontWeight: string | undefined;
  letterSpacing: string | undefined;
};

export type DesignTokens = { palette: PaletteColor[]; colorRoles: ColorRole[]; textRoles: TextRole[] };

export const COLOR_MODES = ["light", "dark"] as const;
export type ColorMode = (typeof COLOR_MODES)[number];

type Declaration = { name: string; value: string };

const COMMENT_PATTERN = /\/\*[\s\S]*?\*\//g;
// `@theme { … }`, `@theme inline { … }` and the plain `:root { … }`, not `:root[data-theme="dark"] { … }`.
const BLOCK_PATTERN = /(@theme\b[^{]*|:root)\s*\{([^}]*)\}/g;
const DECLARATION_PATTERN = /--([\w-]+)\s*:\s*([^;]+);/g;
const HEX_PATTERN = /^#[\da-f]{6}$/i;
const VAR_PATTERN = /^var\(--([\w-]+)\)$/;
const LIGHT_DARK_PATTERN = /^light-dark\((.+),(.+)\)$/;
// The props a text role sets besides its size, like `--text-title--line-height`.
const TEXT_ROLE_PROP_SEPARATOR = "--";

const toDeclarations = (block: string): Declaration[] =>
  Array.from(block.matchAll(DECLARATION_PATTERN), ([, name, value]) => ({ name, value: value.trim() }));

// The tokens in index.css: the palette, the colour roles with their light and dark shades, and the text roles. The docs
// show them from here, so they always list what the stylesheet has.
export const parseDesignTokens = (css: string): DesignTokens => {
  const blocks = Array.from(css.replace(COMMENT_PATTERN, "").matchAll(BLOCK_PATTERN), ([, selector, body]) => ({
    isTheme: selector.startsWith("@theme"),
    declarations: toDeclarations(body),
  }));
  const themeDeclarations = blocks.filter((block) => block.isTheme).flatMap((block) => block.declarations);
  const rootDeclarations = blocks.filter((block) => !block.isTheme).flatMap((block) => block.declarations);

  const palette = rootDeclarations
    .filter((declaration) => HEX_PATTERN.test(declaration.value))
    .map(({ name, value }) => ({ name, hex: value.toLowerCase() }));
  const rootValues = new Map(rootDeclarations.map(({ name, value }) => [name, value]));

  const toColorValue = (reference: string): ColorValue => {
    const name = VAR_PATTERN.exec(reference.trim())?.[1];
    const color = palette.find((entry) => entry.name === name);
    if (isNil(color)) {
      throw new Error(`"${reference.trim()}" isn't a palette colour`);
    }
    return color;
  };

  // Throws for a colour the docs can't resolve, rather than leaving it off the colours page and out of the contrast checks.
  const colorRoles = themeDeclarations
    .filter((declaration) => declaration.name.startsWith("color-"))
    .map(({ name, value }): ColorRole => {
      const roleName = VAR_PATTERN.exec(value)?.[1];
      if (isNil(roleName)) {
        throw new Error(`--${name} should point at a role, like var(--${name.replace("color-", "")}), not "${value}"`);
      }
      const roleValue = rootValues.get(roleName);
      if (isNil(roleValue)) {
        throw new Error(`--${name} uses --${roleName}, which isn't in the plain :root block`);
      }
      const [, light = roleValue, dark = roleValue] = LIGHT_DARK_PATTERN.exec(roleValue) ?? [];
      return { name: roleName, light: toColorValue(light), dark: toColorValue(dark) };
    });

  const themeValues = new Map(themeDeclarations.map(({ name, value }) => [name, value]));
  const textRoles = themeDeclarations
    .filter(
      ({ name, value }) => name.startsWith("text-") && !name.includes(TEXT_ROLE_PROP_SEPARATOR) && value !== "initial",
    )
    .map(({ name, value }) => {
      const lineHeight = themeValues.get(`${name}--line-height`);
      if (isNil(lineHeight)) {
        throw new Error(`--${name} has no line height`);
      }
      return {
        name: name.replace("text-", ""),
        fontSize: value,
        lineHeight,
        fontWeight: themeValues.get(`${name}--font-weight`),
        letterSpacing: themeValues.get(`${name}--letter-spacing`),
      };
    });

  return { palette, colorRoles, textRoles };
};

// WCAG 2's relative luminance of a "#rrggbb" colour.
const toRelativeLuminance = (hex: string): number => {
  const [red, green, blue] = [1, 3, 5].map((start) => {
    const channel = Number.parseInt(hex.slice(start, start + 2), 16) / 255;
    return channel <= 0.040_45 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
};

// WCAG 2's contrast ratio between two colours, from 1 to 21.
export const toContrastRatio = (first: string, second: string): number => {
  const [lighter, darker] = [toRelativeLuminance(first), toRelativeLuminance(second)].sort((a, b) => b - a);
  return (lighter + 0.05) / (darker + 0.05);
};

export type ContrastPair = { foreground: string; background: string; minimum: number };

// A pair's colours and contrast in one mode.
export type ModeContrast = { foregroundHex: string; backgroundHex: string; ratio: number; passes: boolean };

export type ContrastResult = ContrastPair & Record<ColorMode, ModeContrast>;

const findColorRole = (tokens: DesignTokens, name: string): ColorRole => {
  const role = tokens.colorRoles.find((entry) => entry.name === name);
  if (isNil(role)) {
    throw new Error(`There's no colour role called "${name}"`);
  }
  return role;
};

const toModeContrast = (tokens: DesignTokens, pair: ContrastPair, mode: ColorMode): ModeContrast => {
  const foregroundHex = findColorRole(tokens, pair.foreground)[mode].hex;
  const backgroundHex = findColorRole(tokens, pair.background)[mode].hex;
  const ratio = toContrastRatio(foregroundHex, backgroundHex);
  return { foregroundHex, backgroundHex, ratio, passes: ratio >= pair.minimum };
};

// Each pair's contrast in light and in dark mode.
export const toContrastResults = (tokens: DesignTokens, pairs: ContrastPair[]): ContrastResult[] =>
  pairs.map((pair) => ({
    ...pair,
    light: toModeContrast(tokens, pair, "light"),
    dark: toModeContrast(tokens, pair, "dark"),
  }));

const ROOT_FONT_SIZE = 16;

// "3rem" becomes "48px", at the browser's default root font size. Other units stay as they are.
export const toPixels = (size: string): string =>
  size.endsWith("rem") ? `${Number.parseFloat(size) * ROOT_FONT_SIZE}px` : size;

// A palette shade's hue: "gray-700" becomes "gray", and "white" stays "white".
export const toHue = (name: string): string => name.replace(/-\d+$/, "");
