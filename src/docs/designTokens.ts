import { parseDesignTokens } from "./utils/tokenUtil";
import indexCss from "../index.css?raw";

// The tokens of src/index.css as the docs show them.
export const DESIGN_TOKENS = parseDesignTokens(indexCss);
