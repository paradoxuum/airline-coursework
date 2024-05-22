import { idSchema } from "@/actions/schema";
import { db } from "@/db";
import { airplane } from "@/db/schema";
import { defineAction } from "astro:actions";
import { eq } from "drizzle-orm";
import { createSelectSchema } from "drizzle-zod";

const schema = createSelectSchema(airplane);
const inputSchema = schema.omit({
	id: true,
});

export const airplaneActions = {
	getAirplane: defineAction({
		accept: "json",
		input: idSchema,
		handler: async (input) => {
			return await db.select().from(airplane).where(eq(airplane.id, input.id));
		},
	}),
	getAirplanes: defineAction({
		accept: "json",
		handler: async () => {
			return await db.select().from(airplane);
		},
	}),
	createAirplane: defineAction({
		accept: "form",
		input: inputSchema,
		handler: async (input) => {
			await db.insert(airplane).values(input);
		},
	}),
	updateAirplane: defineAction({
		accept: "json",
		input: schema,
		handler: async (input) => {
			await db.update(airplane).set(input).where(eq(airplane.id, input.id));
		},
	}),
	deleteAirplane: defineAction({
		accept: "json",
		input: idSchema,
		handler: async (input) => {
			return await db
				.delete(airplane)
				.where(eq(airplane.id, input.id))
				.returning();
		},
	}),
};
