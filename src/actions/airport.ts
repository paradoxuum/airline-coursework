import { AirportData } from "@/actions/db/airport";
import { checkError } from "@/actions/util";
import { db } from "@/db";
import { airportSchema, type Airport } from "@/schema";
import { ActionError, defineAction } from "astro:actions";
import { instanceToPlain } from "class-transformer";

async function getFromId(id: number) {
	const airport = await AirportData.getFromId(db, id);
	if (airport === undefined) {
		throw new ActionError({
			code: "NOT_FOUND",
			message: `Airport with id ${id} not found`,
		});
	}
	airport.setDatabase(db);
	return airport;
}

export const airportActions = {
	getAll: defineAction({
		handler: () =>
			checkError(async () => {
				return instanceToPlain(await AirportData.getAll(db)) as Airport[];
			}),
	}),

	create: defineAction({
		accept: "json",
		input: airportSchema.omit({ airport_id: true }),
		handler: (input) =>
			checkError(async () => {
				const data = AirportData.createHolder(db, input);
				await data.insert();
				return instanceToPlain(data) as Airport;
			}),
	}),

	update: defineAction({
		accept: "json",
		input: airportSchema.partial().required({ airport_id: true }),
		handler: (input) =>
			checkError(async () => {
				const data = await getFromId(input.airport_id);
				await data.update({
					airport_code: input.airport_code,
				});
				return instanceToPlain(data) as Airport;
			}),
	}),

	delete: defineAction({
		accept: "json",
		input: airportSchema.pick({ airport_id: true }),
		handler: (input) =>
			checkError(async () => {
				const data = await getFromId(input.airport_id);
				await data.delete();
				return instanceToPlain(data) as Airport;
			}),
	}),
};
