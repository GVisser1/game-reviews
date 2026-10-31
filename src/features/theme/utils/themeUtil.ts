// The theme a visitor picked on the account page, kept per device. "system" follows the device's light or dark setting.
export const THEME_PREFERENCES = ["system", "light", "dark"] as const;
export type ThemePreference = (typeof THEME_PREFERENCES)[number];

const STORAGE_KEY = "theme";
const DEFAULT_PREFERENCE: ThemePreference = "system";

const isThemePreference = (value: unknown): value is ThemePreference =>
  THEME_PREFERENCES.includes(value as ThemePreference);

// Storage can be unavailable (private windows, blocked site data); the theme then simply follows the system.
export const readThemePreference = (): ThemePreference => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return isThemePreference(stored) ? stored : DEFAULT_PREFERENCE;
  } catch {
    return DEFAULT_PREFERENCE;
  }
};

// index.css switches colours on `data-theme`; without it, the system setting decides.
export const applyThemePreference = (preference: ThemePreference): void => {
  if (preference === DEFAULT_PREFERENCE) {
    delete document.documentElement.dataset.theme;
  } else {
    document.documentElement.dataset.theme = preference;
  }
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
    // Not saved, but still applied for this visit.
  }
};

// Runs in <head> before the page paints, so a saved theme shows without a flash of the system one.
export const THEME_SCRIPT = `try{var t=localStorage.getItem(${JSON.stringify(STORAGE_KEY)});if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;
