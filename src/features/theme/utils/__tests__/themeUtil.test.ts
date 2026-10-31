// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vite-plus/test";
import {
  readAppliedThemePreference,
  saveThemePreference,
  subscribeToThemePreference,
  THEME_SCRIPT,
} from "../themeUtil";

const STORAGE_KEY = "theme";

afterEach(() => {
  localStorage.clear();
  delete document.documentElement.dataset.theme;
});

describe("readAppliedThemePreference", () => {
  it("follows the system when no theme is applied", () => {
    expect(readAppliedThemePreference()).toBe("system");
  });

  it("reads the applied theme", () => {
    document.documentElement.dataset.theme = "dark";

    expect(readAppliedThemePreference()).toBe("dark");
  });

  it("ignores an unknown value", () => {
    document.documentElement.dataset.theme = "purple";

    expect(readAppliedThemePreference()).toBe("system");
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

describe("subscribeToThemePreference", () => {
  it("calls back when the theme changes, until unsubscribed", async () => {
    const onChange = vi.fn();
    const unsubscribe = subscribeToThemePreference(onChange);

    saveThemePreference("dark");
    await vi.waitFor(() => expect(onChange).toHaveBeenCalledOnce());

    unsubscribe();
    saveThemePreference("light");
    await Promise.resolve();
    expect(onChange).toHaveBeenCalledOnce();
  });
});

describe("THEME_SCRIPT", () => {
  // The script runs as plain inline JavaScript in <head>, so test it the same way.
  // oxlint-disable-next-line typescript/no-implied-eval
  const runScript = (): void => new Function(THEME_SCRIPT)();

  // What the browser sends to the other open tabs when one of them changes storage.
  const changeInAnotherTab = (value: string | null): void => {
    if (value === null) {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY, value);
    }
    window.dispatchEvent(new StorageEvent("storage", { key: STORAGE_KEY, newValue: value }));
  };

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

  it("follows a theme picked in another tab", () => {
    runScript();

    changeInAnotherTab("dark");
    expect(document.documentElement.dataset.theme).toBe("dark");

    changeInAnotherTab(null);
    expect(document.documentElement.dataset.theme).toBeUndefined();
  });
});
