import { idSchema } from "@/actions/schema";
import { db } from "@/db";
import { flights } from "@/db/schema";
import { defineAction } from "astro:actions";
import { eq } from "drizzle-orm";
import { createSelectSchema } from "drizzle-zod";

const schema = createSelectSchema(flights);
const inputSchema = schema.omit({
	id: true,
});

export const flightActions = {
	getFlight: defineAction({
		accept: "json",
		input: idSchema,
		handler: async (input) => {
			return await db.select().from(flights).where(eq(flights.id, input.id));
		},
	}),
	getFlights: defineAction({
		accept: "json",
		handler: async () => {
			return await db.select().from(flights);
		},
	}),
	createFlight: defineAction({
		accept: "json",
		input: inputSchema,
		handler: async (input) => {
			await db.insert(flights).values(input);
		},
	}),
	updateFlight: defineAction({
		accept: "json",
		input: schema,
		handler: async (input) => {
			await db.update(flights).set(input).where(eq(flights.id, input.id));
		},
	}),
	deleteFlight: defineAction({
		accept: "json",
		input: idSchema,
		handler: async (input) => {
			return await db
				.delete(flights)
				.where(eq(flights.id, input.id))
				.returning();
		},
	}),
};
