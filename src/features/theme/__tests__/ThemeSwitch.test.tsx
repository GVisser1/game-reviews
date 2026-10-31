// @vitest-environment jsdom
import { act, cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vite-plus/test";
import { ThemeSwitch } from "../ThemeSwitch";
import { applyThemePreference } from "../utils/themeUtil";

afterEach(() => {
  cleanup();
  localStorage.clear();
  delete document.documentElement.dataset.theme;
});

describe("ThemeSwitch", () => {
  it("applies and saves the theme a player picks", async () => {
    render(<ThemeSwitch />);
    expect(screen.getByRole("radio", { name: "System" })).toHaveProperty("checked", true);

    await userEvent.click(screen.getByRole("radio", { name: "Dark" }));

    expect(screen.getByRole("radio", { name: "Dark" })).toHaveProperty("checked", true);
    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(localStorage.getItem("theme")).toBe("dark");
  });

  it("follows a theme applied elsewhere, like by another tab", async () => {
    render(<ThemeSwitch />);

    // MutationObserver calls back in a microtask.
    await act(async () => applyThemePreference("light"));

    expect(screen.getByRole("radio", { name: "Light" })).toHaveProperty("checked", true);
  });
});
