import pgPromise from "pg-promise";

const PORT = import.meta.env.DB_PORT;

export const pgp = pgPromise({});
export const db = pgp({
	host: import.meta.env.DB_HOST,
	port: PORT !== undefined ? Number.parseInt(PORT) : 5432,
	user: import.meta.env.DB_USER,
	password: import.meta.env.DB_PASSWORD,
	database: import.meta.env.DB_NAME,
	query_timeout: 3000,
});
export type Database = typeof db;
