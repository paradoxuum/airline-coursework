import { airplane, flights, staff } from "@/db/schema";
import { defineAction } from "astro:actions";
import { createInsertSchema } from "drizzle-zod";

export const server = {
	createAirplane: defineAction({
		accept: "form",
		input: createInsertSchema(airplane),
		handler: async (input) => {},
	}),
	createFlight: defineAction({
		accept: "form",
		input: createInsertSchema(flights),
		handler: async (input) => {},
	}),
	createStaff: defineAction({
		accept: "form",
		input: createInsertSchema(staff),
		handler: async (input) => {},
	}),
};
