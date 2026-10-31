import clsx from "clsx";
import { compact } from "lodash-es";
import { DESIGN_TOKENS } from "./designTokens";
import { HEADING_TEXT_ROLES } from "./headingTextRoles";
import type { TextRole } from "./utils/tokenUtil";
import { toPixels } from "./utils/tokenUtil";

const SAMPLE_TEXT = "The Witcher 3: Wild Hunt";

const toSpecs = (role: TextRole): string =>
  compact([
    `${toPixels(role.fontSize)} / ${toPixels(role.lineHeight)}`,
    role.fontWeight && `weight ${role.fontWeight}`,
    role.letterSpacing && `tracking ${role.letterSpacing}`,
  ]).join(" · ");

// Every text role in src/index.css with its size, line height, weight and tracking, set from the tokens themselves. The
// heading roles' samples use the heading font, like they do through Heading.
export const TextRoles = (): React.JSX.Element => (
  <ul className="flex flex-col divide-y divide-line rounded border">
    {DESIGN_TOKENS.textRoles.map((role) => (
      <li key={role.name} className="flex flex-col gap-1 p-4">
        <span className="text-caption text-muted">
          <code className="font-mono text-foreground">text-{role.name}</code> · {toSpecs(role)}
        </span>
        <span
          className={clsx({ "font-heading": HEADING_TEXT_ROLES.includes(role.name) })}
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
