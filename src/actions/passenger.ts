import { PassengerData } from "@/actions/db/passenger";
import { db } from "@/db";
import { passengerSchema } from "@/schema";
import { defineAction } from "astro:actions";
import { plainToInstance } from "class-transformer";
import type { IResult } from "pg-promise/typescript/pg-subset";

export const passengerActions = {
	getAll: defineAction({
		handler: async () => {
			const users = await db.any("SELECT * FROM passengers");

			console.log(users);
			return [];
		},
	}),

	create: defineAction({
		accept: "json",
		input: passengerSchema.omit({ passenger_id: true }),
		handler: async (input) => {
			const data = await db.result(
				`INSERT INTO passengers($1:name)
				VALUES($1:csv)
				RETURNING *`,
				[input],
			);
			return plainToInstance(PassengerData, data).getPassengerId();
		},
	}),

	update: defineAction({
		accept: "json",
		input: passengerSchema.partial().required({ passenger_id: true }),
		handler: async (input) => {
			db.result(
				"UPDATE passengers SET $1:name WHERE passenger_id = $2",
				[input, input.passenger_id],
				(r: IResult) => r.rowCount,
			);
		},
	}),

	delete: defineAction({
		accept: "json",
		input: passengerSchema.pick({ passenger_id: true }),
		handler: async (input) => {
			db.result(
				"DELETE FROM passengers WHERE passenger_id = $1",
				[input.passenger_id],
				(r: IResult) => r.rowCount,
			);
		},
	}),
};
