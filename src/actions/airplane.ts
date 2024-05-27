import { AirplaneData } from "@/actions/db/airplane";
import { db } from "@/db";
import { airplaneSchema, type Airplane } from "@/schema";
import { ActionError, defineAction } from "astro:actions";
import { instanceToPlain, plainToInstance } from "class-transformer";
import type { IResult } from "pg-promise/typescript/pg-subset";

export const airplaneActions = {
	getAll: defineAction({
		handler: async () => {
			const airplanes = await db.any("SELECT * FROM airplanes");
			return instanceToPlain(
				plainToInstance(AirplaneData, airplanes),
			) as Airplane[];
		},
	}),

	create: defineAction({
		accept: "json",
		input: airplaneSchema.omit({ airplane_id: true }),
		handler: async (input) => {
			const data = await db.one<Airplane>(
				`INSERT INTO airplanes($1:name)
				VALUES($1:csv)
				RETURNING *`,
				[input],
			);
			return plainToInstance(AirplaneData, data).getAirplaneId();
		},
	}),

	update: defineAction({
		accept: "json",
		input: airplaneSchema.partial().required({ airplane_id: true }),
		handler: async (input) => {
			await db.result(
				"UPDATE airplanes SET $1:name WHERE airplane_id = $2",
				[input, input.airplane_id],
				(r: IResult) => r.rowCount,
			);
		},
	}),

	delete: defineAction({
		accept: "json",
		input: airplaneSchema.pick({ airplane_id: true }),
		handler: async (input) => {
			const rowCount = await db.result(
				`DELETE FROM airplanes
				WHERE airplane_id = $1
				RETURNING *`,
				[input.airplane_id],
				(r: IResult) => r.rowCount,
			);

			if (rowCount === 0) {
				throw new ActionError({
					code: "NOT_FOUND",
					message: `Airplane with id ${input.airplane_id} not found`,
				});
			}
		},
	}),
};
