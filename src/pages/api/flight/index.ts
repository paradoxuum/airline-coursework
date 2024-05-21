import { db } from "@/db";
import { flights } from "@/db/schema";
import { getResponse } from "@/utils";
import type { APIRoute } from "astro";

export const GET: APIRoute = async () => {
	const result = await db.select().from(flights);
	return getResponse(200, result);
};
