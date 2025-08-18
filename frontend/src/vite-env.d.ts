/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VUE_APP_OPENAI_API_KEY: string;
    readonly VITE_SPOTIFY_CLIENT_ID: string;
    readonly VITE_SPOTIFY_CLIENT_SECRET: string;
    // add more env vars here if needed
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
