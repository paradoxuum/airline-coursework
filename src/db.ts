import pgPromise from "pg-promise";

const HOST = import.meta.env.DB_HOST ?? "localhost";
const PORT = import.meta.env.DB_PORT ?? "5432";
const NAME = import.meta.env.DB_NAME;
const USER = import.meta.env.DB_USER;
const PASS = import.meta.env.DB_PASSWORD;

const pgp = pgPromise({});
export const db = pgp(`postgres://${USER}:${PASS}@${HOST}:${PORT}/${NAME}`);
export type Database = typeof db;
