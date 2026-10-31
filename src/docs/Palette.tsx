import { groupBy } from "lodash-es";
import { ColorSwatch } from "./ColorSwatch";
import { DESIGN_TOKENS } from "./designTokens";
import { toHue } from "./utils/tokenUtil";

const HUES = Object.entries(groupBy(DESIGN_TOKENS.palette, (color) => toHue(color.name)));
const USED_SHADES = new Set(DESIGN_TOKENS.colorRoles.flatMap((role) => [role.light.name, role.dark.name]));

// Every palette shade in src/index.css by hue, marking the ones a colour role uses.
export const Palette = (): React.JSX.Element => (
  <div className="flex flex-col gap-3 overflow-x-auto">
    {HUES.map(([hue, colors]) => (
      <div key={hue} className="flex items-center gap-3">
        <span className="w-14 shrink-0 font-mono text-caption text-muted">{hue}</span>
        <ul className="grid min-w-lg flex-1 grid-cols-10 gap-1">
          {colors.map((color) => (
            <li key={color.name} title={`${color.name}: ${color.hex}`} className="flex flex-col gap-1">
              <ColorSwatch hex={color.hex} className="h-8 w-full" />
              <span className={USED_SHADES.has(color.name) ? "text-caption font-medium" : "text-caption text-muted"}>
                {color.name.replace(`${hue}-`, "")}
                {USED_SHADES.has(color.name) && " •"}
              </span>
            </li>
          ))}
        </ul>
      </div>
    ))}
  </div>
);
