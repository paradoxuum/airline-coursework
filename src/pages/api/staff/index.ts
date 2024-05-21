import { db } from "@/db";
import { staff } from "@/db/schema";
import { getResponse } from "@/utils";
import type { APIRoute } from "astro";

export const GET: APIRoute = async () => {
	const result = await db.select().from(staff);
	return getResponse(200, result);
};
