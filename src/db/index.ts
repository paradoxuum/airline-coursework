import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const dbHost = import.meta.env.DB_HOST;
const dbUser = import.meta.env.DB_USERNAME;
const dbPassword = import.meta.env.DB_PASSWORD;
const dbName = import.meta.env.DB_NAME;

const queryClient = postgres(
	`postgres://${dbUser}:${dbPassword}@${dbHost}/${dbName}`,
);
export const db = drizzle(queryClient);
