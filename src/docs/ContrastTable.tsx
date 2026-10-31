import { CONTRAST_PAIRS } from "./contrastPairs";
import { DESIGN_TOKENS } from "./designTokens";
import { CELL_CLASS_NAME, DocsTable } from "./DocsTable";
import type { ModeContrast } from "./utils/tokenUtil";
import { COLOR_MODES, toContrastResults } from "./utils/tokenUtil";

const HEADERS = ["Pair", "Needs", "Light", "Dark"];

const RESULTS = toContrastResults(DESIGN_TOKENS, CONTRAST_PAIRS);

const ContrastCell = ({ contrast }: { contrast: ModeContrast }): React.JSX.Element => (
  <td className={CELL_CLASS_NAME}>
    <span className="flex items-center gap-2">
      <span
        aria-hidden
        className="rounded border px-2 font-medium"
        style={{ color: contrast.foregroundHex, backgroundColor: contrast.backgroundHex }}
      >
        Aa
      </span>
      <span className={contrast.passes ? undefined : "font-medium text-danger"}>
        {contrast.ratio.toFixed(2)}:1{contrast.passes ? "" : " — too low"}
      </span>
    </span>
  </td>
);

// The colour roles that go together, with their contrast in each mode, computed from src/index.css.
export const ContrastTable = (): React.JSX.Element => (
  <DocsTable headers={HEADERS}>
    {RESULTS.map((result) => (
      <tr key={`${result.foreground}-${result.background}`}>
        <td className={`${CELL_CLASS_NAME} font-mono whitespace-nowrap`}>
          {result.foreground} on {result.background}
        </td>
        <td className={CELL_CLASS_NAME}>{result.minimum}:1</td>
        {COLOR_MODES.map((mode) => (
          <ContrastCell key={mode} contrast={result[mode]} />
        ))}
      </tr>
    ))}
  </DocsTable>
);
