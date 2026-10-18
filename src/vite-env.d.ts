/// <reference types="vite-plus/client" />

type ImportMetaEnv = {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_PUBLISHABLE_KEY: string;
  // Cloudflare Turnstile site key. Without it, anonymous sign-ins skip the bot check (Supabase must not require one).
  readonly VITE_TURNSTILE_SITE_KEY?: string;
};

type ImportMeta = {
  readonly env: ImportMetaEnv;
};
