import {
	DatabaseHolder,
	type DatabaseInteractions,
} from "@/actions/db/database";
import { pgp, type Database } from "@/db";
import type { Airport } from "@/schema";
import { plainToInstance } from "class-transformer";

export class AirportData
	extends DatabaseHolder
	implements DatabaseInteractions<AirportData, Omit<Airport, "airport_id">>
{
	constructor(
		database: Database,
		private airport_id: number,
		private airport_code: string,
	) {
		super(database);
	}

	/**
	 * Creates a new instance of AirportData with the given data. This should primarily be used
	 * when creating a new airport.
	 * @param database The database to use
	 * @param data The data to use
	 * @returns The new instance
	 */
	static createHolder(db: Database, data: Omit<Airport, "airport_id">) {
		return new AirportData(db, 0, data.airport_code);
	}

	/**
	 * Creates a AirplaneData instance by querying an airplane from
	 * the database with the given id.
	 *
	 * @param db The database to use
	 * @param id The id of the airplane to get
	 * @returns The instance of the airplane
	 */
	static async getFromId(db: Database, id: number) {
		const result = await db.oneOrNone<Airport | undefined>(
			"SELECT * FROM airports WHERE airport_id = $1",
			[id],
		);
		if (result === undefined) return;

		return plainToInstance(AirportData, result);
	}

	static async getAll(db: Database) {
		const result = await db.any<Airport>("SELECT * FROM airports");
		return result.map((data) => plainToInstance(AirportData, data));
	}

	async insert() {
		const data = await this.getDatabase().one<Airport>(
			`INSERT INTO airports($1:name)
			VALUES($1:csv)
			RETURNING *`,
			[
				{
					airport_code: this.airport_code,
				} as Omit<Airport, "airport_id">,
			],
		);
		this.airport_id = data.airport_id;
	}

	async update(data: Partial<Omit<Airport, "airport_id">>) {
		this.airport_code = data.airport_code ?? this.airport_code;

		const query = pgp.helpers.update(data, undefined, "airports");
		await this.getDatabase().result(`${query} WHERE airport_id = $1`, [
			this.airport_id,
		]);
	}

	async delete() {
		await this.getDatabase().result(
			"DELETE FROM airports WHERE airport_id = $1",
			[this.airport_id],
		);
	}

	getAirportId() {
		return this.airport_id;
	}

	getAirportCode() {
		return this.airport_code;
	}
}
