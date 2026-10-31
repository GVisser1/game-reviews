// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vite-plus/test";
import { readThemePreference, saveThemePreference, THEME_SCRIPT } from "../themeUtil";

const STORAGE_KEY = "theme";

afterEach(() => {
  localStorage.clear();
  delete document.documentElement.dataset.theme;
});

describe("readThemePreference", () => {
  it("follows the system when nothing is saved", () => {
    expect(readThemePreference()).toBe("system");
  });

  it("reads a saved theme", () => {
    localStorage.setItem(STORAGE_KEY, "dark");

    expect(readThemePreference()).toBe("dark");
  });

  it("ignores an unknown saved value", () => {
    localStorage.setItem(STORAGE_KEY, "purple");

    expect(readThemePreference()).toBe("system");
  });
});

describe("saveThemePreference", () => {
  it("saves and applies a light or dark theme", () => {
    saveThemePreference("dark");

    expect(localStorage.getItem(STORAGE_KEY)).toBe("dark");
    expect(document.documentElement.dataset.theme).toBe("dark");
  });

  it("goes back to the system setting", () => {
    saveThemePreference("light");
    saveThemePreference("system");

    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    expect(document.documentElement.dataset.theme).toBeUndefined();
  });
});

describe("THEME_SCRIPT", () => {
  // The script runs as plain inline JavaScript in <head>, so test it the same way.
  // oxlint-disable-next-line typescript/no-implied-eval
  const runScript = (): void => new Function(THEME_SCRIPT)();

  it("applies a saved theme", () => {
    localStorage.setItem(STORAGE_KEY, "light");

    runScript();

    expect(document.documentElement.dataset.theme).toBe("light");
  });

  it("leaves the system setting in charge without a valid saved theme", () => {
    localStorage.setItem(STORAGE_KEY, "<script>");

    runScript();

    expect(document.documentElement.dataset.theme).toBeUndefined();
  });
});
