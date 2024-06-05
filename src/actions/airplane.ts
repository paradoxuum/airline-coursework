import { AirplaneData } from "@/actions/db/airplane";
import { checkError } from "@/actions/util";
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
	airplane.setDatabase(db);
	return airplane;
}

export const airplaneActions = {
	getAll: defineAction({
		handler: () =>
			checkError(async () => {
				return instanceToPlain(await AirplaneData.getAll(db)) as Airplane[];
			}),
	}),

	create: defineAction({
		accept: "json",
		input: airplaneSchema.omit({ airplane_id: true }),
		handler: (input) =>
			checkError(async () => {
				const data = AirplaneData.createHolder(db, input);
				await data.insert();
				return instanceToPlain(data) as Airplane;
			}),
	}),

	update: defineAction({
		accept: "json",
		input: airplaneSchema.partial().required({ airplane_id: true }),
		handler: (input) =>
			checkError(async () => {
				const data = await getFromId(input.airplane_id);
				await data.update({
					manufacturer: input.manufacturer,
					model: input.model,
					serial_number: input.serial_number,
				});
				return instanceToPlain(data) as Airplane;
			}),
	}),

	delete: defineAction({
		accept: "json",
		input: airplaneSchema.pick({ airplane_id: true }),
		handler: (input) =>
			checkError(async () => {
				const data = await getFromId(input.airplane_id);
				await data.delete();
				return instanceToPlain(data) as Airplane;
			}),
	}),
};
