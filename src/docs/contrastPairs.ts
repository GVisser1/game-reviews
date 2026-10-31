import type { ContrastPair } from "./utils/tokenUtil";

const TEXT_CONTRAST = 4.5;
const GRAPHICS_CONTRAST = 3;
const TEXT_ROLES = ["foreground", "muted", "accent", "danger"];
const TEXT_BACKGROUNDS = ["page", "surface"];

// The colour roles that are meant to go together, and the WCAG contrast each pair needs in both modes. The colours page
// shows them, and a unit test fails when a pair falls short.
export const CONTRAST_PAIRS: ContrastPair[] = [
  ...TEXT_ROLES.flatMap((foreground) =>
    TEXT_BACKGROUNDS.map((background) => ({ foreground, background, minimum: TEXT_CONTRAST })),
  ),
  ...TEXT_BACKGROUNDS.map((background) => ({ foreground: "rating", background, minimum: GRAPHICS_CONTRAST })),
  { foreground: "on-accent", background: "accent", minimum: TEXT_CONTRAST },
  { foreground: "on-accent", background: "accent-hover", minimum: TEXT_CONTRAST },
  { foreground: "on-danger", background: "danger-solid", minimum: TEXT_CONTRAST },
  { foreground: "on-danger", background: "danger-solid-hover", minimum: TEXT_CONTRAST },
];
