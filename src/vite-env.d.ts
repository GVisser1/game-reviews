/// <reference types="vite-plus/client" />

type ImportMetaEnv = {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_PUBLISHABLE_KEY: string;
};

type ImportMeta = {
  readonly env: ImportMetaEnv;
};
