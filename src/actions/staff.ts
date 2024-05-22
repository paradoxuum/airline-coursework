import { idSchema } from "@/actions/schema";
import { db } from "@/db";
import { staff } from "@/db/schema";
import { defineAction } from "astro:actions";
import { eq } from "drizzle-orm";
import { createSelectSchema } from "drizzle-zod";

const schema = createSelectSchema(staff);
const inputSchema = schema.omit({
	id: true,
});

export const staffActions = {
	getEmployee: defineAction({
		accept: "json",
		input: idSchema,
		handler: async (input) => {
			return await db.select().from(staff).where(eq(staff.id, input.id));
		},
	}),
	getEmployees: defineAction({
		accept: "json",
		handler: async () => {
			return await db.select().from(staff);
		},
	}),
	createEmployee: defineAction({
		accept: "form",
		input: inputSchema,
		handler: async (input) => {
			await db.insert(staff).values(input);
		},
	}),
	updateEmployee: defineAction({
		accept: "json",
		input: schema,
		handler: async (input) => {
			await db.update(staff).set(input).where(eq(staff.id, input.id));
		},
	}),
	deleteEmployee: defineAction({
		accept: "json",
		input: idSchema,
		handler: async (input) => {
			return await db.delete(staff).where(eq(staff.id, input.id)).returning();
		},
	}),
};
