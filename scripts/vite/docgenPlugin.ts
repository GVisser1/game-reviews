import { readFile } from "node:fs/promises";
import { builtinResolvers, parse } from "react-docgen";
import type { Plugin } from "vite-plus";

const QUERY = "?docgen";

// `import docs from "./Button.tsx?docgen"` gives the props of the components a file exports: names, types, whether
// they're required, defaults and their JSDoc descriptions. The docs pages build their props tables from it, so those
// always match the code. react-docgen reads the source with Babel, because TypeScript 7 has no compiler API to ask.
export const docgenPlugin = (): Plugin => ({
  name: "game-reviews:docgen",
  enforce: "pre",
  async load(id) {
    if (!id.endsWith(QUERY)) {
      return null;
    }
    const file = id.slice(0, -QUERY.length);
    this.addWatchFile(file);
    const docs = parse(await readFile(file, "utf8"), {
      filename: file,
      resolver: new builtinResolvers.FindExportedDefinitionsResolver(),
      babelOptions: { babelrc: false, configFile: false },
    });
    return `export default ${JSON.stringify(docs)};`;
  },
});
