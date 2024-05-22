import { db } from "@/db";
import { flights } from "@/db/schema";
import { getResponse } from "@/utils";
import type { APIRoute } from "astro";
import { eq } from "drizzle-orm";

export const GET: APIRoute = async ({ params }) => {
	const id = params.id;
	if (!id) {
		return getResponse(400, "Bad Request");
	}

	const result = await db
		.select()
		.from(flights)
		.where(eq(flights.id, Number.parseInt(id)));

	return getResponse(200, result);
};