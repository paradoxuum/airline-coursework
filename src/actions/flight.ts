import { FlightData } from "@/actions/db/flight";
import { db } from "@/db";
import { flightSchema, type Flight } from "@/schema";
import { defineAction } from "astro:actions";
import { instanceToPlain, plainToInstance } from "class-transformer";
import type { IResult } from "pg-promise/typescript/pg-subset";

export const flightActions = {
	getAll: defineAction({
		handler: async () => {
			const flights = await db.any("SELECT * FROM flights");
			return instanceToPlain(plainToInstance(FlightData, flights)) as Flight[];
		},
	}),

	create: defineAction({
		accept: "json",
		input: flightSchema.omit({ flight_id: true }),
		handler: async (input) => {
			const data = await db.one<Flight>(
				`INSERT INTO flights($1:name)
				VALUES($1:csv)
				RETURNING *`,
				[input],
			);
			return plainToInstance(FlightData, data).getFlightId();
		},
	}),

	update: defineAction({
		accept: "json",
		input: flightSchema.partial().required({ flight_id: true }),
		handler: async (input) => {
			const flightId = input.flight_id;
			db.result(
				"UPDATE flights SET $1:name WHERE flight_id = $2",
				[input, input.flight_id],
				(r: IResult) => r.rowCount,
			);
		},
	}),

	delete: defineAction({
		accept: "json",
		input: flightSchema.pick({ flight_id: true }),
		handler: async (input) => {
			db.result(
				"DELETE FROM flights WHERE flight_id = $1",
				[input.flight_id],
				(r: IResult) => r.rowCount,
			);
		},
	}),
};
