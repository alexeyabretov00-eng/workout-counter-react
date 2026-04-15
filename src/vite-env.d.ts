/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_PREFIX: string | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
