import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, lazyPlugins } from "vite-plus";

export default defineConfig({
  staged: {
    "*": "vp check --fix",
  },
  fmt: {
    printWidth: 120,
    singleQuote: false,
    sortPackageJson: false,
    ignorePatterns: ["node_modules"],
    trailingComma: "all",
    sortTailwindcss: {
      stylesheet: "./src/index.css",
      attributes: ["className"],
      functions: ["clsx"],
    },
    sortImports: {
      ignoreCase: true,
      order: "asc",
      newlinesBetween: false,
    },
  },
  lint: {
    // Edge functions run on Deno, not Node, so the Node type checker can't resolve `Deno`.
    ignorePatterns: ["supabase/functions/**"],
    plugins: ["react", "typescript", "oxc"],
    rules: {
      "react/rules-of-hooks": "error",
      "react/only-export-components": ["warn", { allowConstantExport: true }],
      "vite-plus/prefer-vite-plus-imports": "error",
    },
    options: {
      typeAware: true,
      typeCheck: true,
    },
    jsPlugins: [
      {
        name: "vite-plus",
        specifier: "vite-plus/oxlint-plugin",
      },
    ],
  },
  plugins: lazyPlugins(() => [react(), tailwindcss()]),
  server: {
    // Supabase only allows the Twitch sign-in to redirect back to this port, so fail instead of picking another.
    port: 5173,
    strictPort: true,
  },
});
