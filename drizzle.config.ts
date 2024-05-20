import dotenv from "dotenv";
import { defineConfig } from "drizzle-kit";

dotenv.config();

export default defineConfig({
	dialect: "postgresql",
	schema: "./src/db/schema.ts",
	out: "./drizzle",
	dbCredentials: {
		host: process.env.DB_HOST!,
		user: process.env.DB_USERNAME!,
		password: process.env.DB_PASSWORD!,
		database: process.env.DB_NAME!,
	},
});
