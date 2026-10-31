// The theme a visitor picked on the account page, kept per device. "system" follows the device's light or dark setting.
export const THEME_PREFERENCES = ["system", "light", "dark"] as const;
export type ThemePreference = (typeof THEME_PREFERENCES)[number];

const STORAGE_KEY = "theme";
const DEFAULT_PREFERENCE: ThemePreference = "system";
// The themes that are saved and set as `data-theme`; "system" is the absence of both.
const SAVED_PREFERENCES = THEME_PREFERENCES.filter((preference) => preference !== DEFAULT_PREFERENCE);

const isThemePreference = (value: unknown): value is ThemePreference =>
  THEME_PREFERENCES.includes(value as ThemePreference);

// index.css switches colours on `data-theme`; without it, the system setting decides. It's also the one place the
// current theme lives: THEME_SCRIPT sets it from storage, and the theme switch reads it.
export const applyThemePreference = (preference: ThemePreference): void => {
  if (preference === DEFAULT_PREFERENCE) {
    delete document.documentElement.dataset.theme;
  } else {
    document.documentElement.dataset.theme = preference;
  }
};

export const readAppliedThemePreference = (): ThemePreference => {
  const applied = document.documentElement.dataset.theme;
  return isThemePreference(applied) ? applied : DEFAULT_PREFERENCE;
};

// Calls `onChange` whenever the theme changes, whether picked here or in another tab.
export const subscribeToThemePreference = (onChange: () => void): (() => void) => {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
};

export const saveThemePreference = (preference: ThemePreference): void => {
  applyThemePreference(preference);
  try {
    if (preference === DEFAULT_PREFERENCE) {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY, preference);
    }
  } catch {
    // Storage can be unavailable (private windows, blocked site data): not saved, but still applied for this visit.
  }
};

// Runs in <head> before the page paints, so a saved theme shows without a flash of the system one. It applies the theme
// again when another tab saves a different one (storage events only reach the other tabs), so every open page matches.
export const THEME_SCRIPT = `(function(){var k=${JSON.stringify(STORAGE_KEY)},v=${JSON.stringify(SAVED_PREFERENCES)},r=document.documentElement;function a(){try{var t=localStorage.getItem(k);if(v.indexOf(t)>=0)r.dataset.theme=t;else delete r.dataset.theme}catch(e){}}a();addEventListener("storage",function(e){if(e.key===k||e.key===null)a()})})()`;
