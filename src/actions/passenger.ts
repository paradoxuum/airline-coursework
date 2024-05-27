import { PassengerData } from "@/actions/db/passenger";
import { db } from "@/db";
import { passengerSchema, type Passenger } from "@/schema";
import { ActionError, defineAction } from "astro:actions";
import { instanceToPlain } from "class-transformer";

async function getFromId(id: number) {
	const data = await PassengerData.getFromId(db, id);
	if (data === undefined) {
		throw new ActionError({
			code: "NOT_FOUND",
			message: `Passenger with id ${id} not found`,
		});
	}
	return data;
}

export const passengerActions = {
	getAll: defineAction({
		handler: async () => {
			return instanceToPlain(await PassengerData.getAll(db)) as Passenger[];
		},
	}),

	create: defineAction({
		accept: "json",
		input: passengerSchema.omit({ passenger_id: true }),
		handler: async (input) => {
			return PassengerData.createHolder(db, input).insert();
		},
	}),

	update: defineAction({
		accept: "json",
		input: passengerSchema.partial().required({ passenger_id: true }),
		handler: async (input) => {
			const data = await getFromId(input.passenger_id);
			data.setDatabase(db);
			await data.update(input);
		},
	}),

	delete: defineAction({
		accept: "json",
		input: passengerSchema.pick({ passenger_id: true }),
		handler: async (input) => {
			const data = await getFromId(input.passenger_id);
			data.setDatabase(db);
			await data.delete();
		},
	}),
};
