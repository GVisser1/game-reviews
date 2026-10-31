import type { ReactNode } from "react";

// The colour roles' light-dark() values follow the nearest colour-scheme, so each column shows its own mode. Only the
// first is live: the others are inert and hidden from screen readers, so the page doesn't get duplicate headings and
// labels, or a second copy of a stateful example that drifts out of sync.
const MODES = [
  { name: "Light", colorScheme: "light", isLive: true },
  { name: "Dark", colorScheme: "dark", isLive: false },
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
        inert={!mode.isLive}
        aria-hidden={!mode.isLive}
        style={{ colorScheme: mode.colorScheme }}
        className="flex flex-col gap-4 bg-page p-6 text-foreground"
      >
        <span className="text-caption text-muted">
          {mode.name}
          {!mode.isLive && " (preview only)"}
        </span>
        {children}
      </div>
    ))}
  </div>
);
