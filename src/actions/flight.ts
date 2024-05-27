import { FlightData } from "@/actions/db/flight";
import { db } from "@/db";
import { flightSchema, type Flight } from "@/schema";
import { ActionError, defineAction } from "astro:actions";
import { instanceToPlain } from "class-transformer";

async function getFromId(id: number) {
	const data = await FlightData.getFromId(db, id);
	if (data === undefined) {
		throw new ActionError({
			code: "NOT_FOUND",
			message: `Flight with id ${id} not found`,
		});
	}
	return data;
}

export const flightActions = {
	getAll: defineAction({
		handler: async () => {
			return instanceToPlain(await FlightData.getAll(db)) as Flight[];
		},
	}),

	create: defineAction({
		accept: "json",
		input: flightSchema.omit({ flight_id: true }),
		handler: async (input) => {
			return FlightData.createHolder(db, input).insert();
		},
	}),

	update: defineAction({
		accept: "json",
		input: flightSchema.partial().required({ flight_id: true }),
		handler: async (input) => {
			const data = await getFromId(input.flight_id);
			data.setDatabase(db);
			await data.update(input);
		},
	}),

	delete: defineAction({
		accept: "json",
		input: flightSchema.pick({ flight_id: true }),
		handler: async (input) => {
			const data = await getFromId(input.flight_id);
			data.setDatabase(db);
			await data.delete();
		},
	}),
};
