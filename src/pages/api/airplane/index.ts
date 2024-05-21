import { db } from "@/db";
import { airplane } from "@/db/schema";
import { getResponse } from "@/utils";
import type { APIRoute } from "astro";

export const GET: APIRoute = async () => {
	const result = await db.select().from(airplane);
	return getResponse(200, result);
};
