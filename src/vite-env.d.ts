/// <reference types="vite-plus/client" />
/// <reference types="mdx" />

type ImportMetaEnv = {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_PUBLISHABLE_KEY: string;
  // Cloudflare Turnstile site key. Without it, anonymous sign-ins skip the bot check (Supabase must not require one).
  readonly VITE_TURNSTILE_SITE_KEY?: string;
};

type ImportMeta = {
  readonly env: ImportMetaEnv;
};

// Props of the components a file exports, from scripts/vite/docgenPlugin.ts.
declare module "*?docgen" {
  const docs: import("react-docgen").Documentation[];
  export default docs;
}

// A *.docs.mdx page's frontmatter, exported by remark-mdx-frontmatter.
declare module "*.docs.mdx" {
  export const frontmatter: { title: string; group: string; description: string };
}
