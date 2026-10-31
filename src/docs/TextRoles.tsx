import clsx from "clsx";
import { compact, isNil } from "lodash-es";
import { DESIGN_TOKENS } from "./designTokens";
import type { TextRole } from "./utils/tokenUtil";
import { toPixels } from "./utils/tokenUtil";

const SAMPLE_TEXT = "The Witcher 3: Wild Hunt";

const toSpecs = (role: TextRole): string =>
  compact([
    `${toPixels(role.fontSize)} / ${toPixels(role.lineHeight)}`,
    role.fontWeight && `weight ${role.fontWeight}`,
    role.letterSpacing && `tracking ${role.letterSpacing}`,
  ]).join(" · ");

// Every text role in src/index.css with its size, line height, weight and tracking, set from the tokens themselves.
// Only the heading roles set a weight, and they're used with Heading, so those samples use the heading font.
export const TextRoles = (): React.JSX.Element => (
  <ul className="flex flex-col divide-y divide-line rounded border">
    {DESIGN_TOKENS.textRoles.map((role) => (
      <li key={role.name} className="flex flex-col gap-1 p-4">
        <span className="text-caption text-muted">
          <code className="font-mono text-foreground">text-{role.name}</code> · {toSpecs(role)}
        </span>
        <span
          className={clsx({ "font-heading": !isNil(role.fontWeight) })}
          style={{
            fontSize: role.fontSize,
            lineHeight: role.lineHeight,
            fontWeight: role.fontWeight,
            letterSpacing: role.letterSpacing,
          }}
        >
          {SAMPLE_TEXT}
        </span>
      </li>
    ))}
  </ul>
);
