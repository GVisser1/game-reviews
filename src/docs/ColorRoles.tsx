import { ColorSwatch } from "./ColorSwatch";
import { DESIGN_TOKENS } from "./designTokens";
import { CELL_CLASS_NAME, DocsTable } from "./DocsTable";
import type { ColorValue } from "./utils/tokenUtil";

const HEADERS = ["Role", "Light", "Dark"];

const ColorValueCell = ({ value }: { value: ColorValue }): React.JSX.Element => (
  <td className={CELL_CLASS_NAME}>
    <span className="flex items-center gap-2">
      <ColorSwatch hex={value.hex} className="size-6" />
      <span className="flex flex-col">
        <span className="font-mono">{value.name}</span>
        <span className="font-mono text-caption text-muted">{value.hex}</span>
      </span>
    </span>
  </td>
);

// Every colour role in src/index.css with the palette shade it uses in each mode.
export const ColorRoles = (): React.JSX.Element => (
  <DocsTable headers={HEADERS}>
    {DESIGN_TOKENS.colorRoles.map((role) => (
      <tr key={role.name}>
        <td className={`${CELL_CLASS_NAME} font-mono whitespace-nowrap`}>{role.name}</td>
        <ColorValueCell value={role.light} />
        <ColorValueCell value={role.dark} />
      </tr>
    ))}
  </DocsTable>
);
