import { useSyncExternalStore } from "react";
import type { ThemePreference } from "./utils/themeUtil";
import { readAppliedThemePreference, saveThemePreference, subscribeToThemePreference } from "./utils/themeUtil";

const OPTIONS: { value: ThemePreference; label: string }[] = [
  { value: "system", label: "System" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
];

// Server renders don't know the visitor's theme; the page corrects it when it hydrates.
const SERVER_PREFERENCE: ThemePreference = "system";

export const ThemeSwitch = (): React.JSX.Element => {
  // Follows the applied theme, so a choice made in another tab shows here too.
  const preference = useSyncExternalStore(
    subscribeToThemePreference,
    readAppliedThemePreference,
    () => SERVER_PREFERENCE,
  );

  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="mb-2 text-small text-muted">Theme, saved on this device</legend>
      <div className="flex gap-2">
        {OPTIONS.map((option) => (
          <label
            key={option.value}
            className="flex cursor-pointer items-center gap-2 rounded border px-3 py-2 text-small has-checked:border-accent has-checked:bg-accent-subtle"
          >
            <input
              type="radio"
              name="theme"
              value={option.value}
              checked={preference === option.value}
              onChange={() => saveThemePreference(option.value)}
              className="accent-accent"
            />
            {option.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
};
