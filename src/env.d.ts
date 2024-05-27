/// <reference path="../.astro/actions.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
	readonly DB_HOST: string;
	readonly DB_PORT: string;
	readonly DB_NAME: string;
	readonly DB_USER: string;
	readonly DB_PASSWORD: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
