import { AirplaneData } from "@/actions/db/airplane";
import { db } from "@/db";
import { airplaneSchema, type Airplane } from "@/schema";
import { ActionError, defineAction } from "astro:actions";
import { instanceToPlain } from "class-transformer";

async function getFromId(id: number) {
	const airplane = await AirplaneData.getFromId(db, id);
	if (airplane === undefined) {
		throw new ActionError({
			code: "NOT_FOUND",
			message: `Airplane with id ${id} not found`,
		});
	}
	return airplane;
}

export const airplaneActions = {
	getAll: defineAction({
		handler: async () => {
			return instanceToPlain(await AirplaneData.getAll(db)) as Airplane[];
		},
	}),

	create: defineAction({
		accept: "json",
		input: airplaneSchema.omit({ airplane_id: true }),
		handler: async (input) => {
			return AirplaneData.createHolder(db, input).insert();
		},
	}),

	update: defineAction({
		accept: "json",
		input: airplaneSchema.partial().required({ airplane_id: true }),
		handler: async (input) => {
			const data = await getFromId(input.airplane_id);
			data.setDatabase(db);
			await data.update(input);
		},
	}),

	delete: defineAction({
		accept: "json",
		input: airplaneSchema.pick({ airplane_id: true }),
		handler: async (input) => {
			const data = await getFromId(input.airplane_id);
			data.setDatabase(db);
			await data.delete();
		},
	}),
};
