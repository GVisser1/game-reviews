import type { ReactNode } from "react";

// The colour roles' light-dark() values follow the nearest colour-scheme, so each column shows its own mode.
const MODES = [
  { name: "Light", colorScheme: "light" },
  { name: "Dark", colorScheme: "dark" },
] as const;

type DemoProps = {
  // The example, written inline in the docs page.
  children: ReactNode;
};

// A live example in light and dark mode side by side.
export const Demo = ({ children }: DemoProps): React.JSX.Element => (
  <div className="grid overflow-hidden rounded border lg:grid-cols-2">
    {MODES.map((mode) => (
      <div
        key={mode.colorScheme}
        style={{ colorScheme: mode.colorScheme }}
        className="flex flex-col gap-4 bg-page p-6 text-foreground"
      >
        <span className="text-caption text-muted">{mode.name}</span>
        {children}
      </div>
    ))}
  </div>
);
