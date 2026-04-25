interface ImportMetaEnv {
  readonly VITE_BACKEND_URL: string
  readonly VITE_GA_MEASUREMENT_ID?: string
  readonly VITE_SIMPLE_ANALYTICS_DOMAIN?: string
  readonly VITE_SIMPLE_ANALYTICS_SCRIPT_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
