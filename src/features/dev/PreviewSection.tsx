import type { ReactNode } from "react";
import { Heading } from "../../shared/Heading";

// The colour roles' light-dark() values follow the nearest colour-scheme, so each column shows its own mode.
const MODES = [
  { name: "Light", colorScheme: "light" },
  { name: "Dark", colorScheme: "dark" },
] as const;

type PreviewSectionProps = {
  title: string;
  children: ReactNode;
};

// One example state of a component, shown twice side by side: in light and in dark mode.
export const PreviewSection = ({ title, children }: PreviewSectionProps): React.JSX.Element => (
  <section className="flex flex-col gap-3">
    <Heading as="h2" className="text-heading">
      {title}
    </Heading>
    <div className="grid gap-4 lg:grid-cols-2">
      {MODES.map((mode) => (
        <div
          key={mode.colorScheme}
          style={{ colorScheme: mode.colorScheme }}
          className="flex flex-col gap-4 rounded border bg-page p-6 text-foreground"
        >
          <span className="text-caption text-muted">{mode.name}</span>
          {children}
        </div>
      ))}
    </div>
  </section>
);
