import { FlightData } from "@/actions/db/flight";
import { checkError } from "@/actions/util";
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
		handler: () =>
			checkError(async () => {
				return instanceToPlain(await FlightData.getAll(db)) as Flight[];
			}),
	}),

	create: defineAction({
		accept: "json",
		input: flightSchema.omit({ flight_id: true }),
		handler: (input) =>
			checkError(async () => {
				const data = FlightData.createHolder(db, input);
				await data.insert();
				return instanceToPlain(data) as Flight;
			}),
	}),

	update: defineAction({
		accept: "json",
		input: flightSchema.partial().required({ flight_id: true }),
		handler: (input) =>
			checkError(async () => {
				const data = await getFromId(input.flight_id);
				data.setDatabase(db);
				await data.update({
					arrival_date: input.arrival_date,
					departure_date: input.departure_date,
					flight_number: input.flight_number,
					airplane_id: input.airplane_id,
				});
				return instanceToPlain(data) as Flight;
			}),
	}),

	delete: defineAction({
		accept: "json",
		input: flightSchema.pick({ flight_id: true }),
		handler: (input) =>
			checkError(async () => {
				const data = await getFromId(input.flight_id);
				data.setDatabase(db);
				await data.delete();
				return instanceToPlain(data) as Flight;
			}),
	}),
};
