import {
	DatabaseHolder,
	type DatabaseInteractions,
} from "@/actions/db/database";
import { pgp, type Database } from "@/db";
import type { Airplane } from "@/schema";
import { plainToInstance } from "class-transformer";

export class AirplaneData
	extends DatabaseHolder
	implements DatabaseInteractions<AirplaneData, Omit<Airplane, "airplane_id">>
{
	constructor(
		database: Database,
		private airplane_id: number,
		private manufacturer: string,
		private model: string,
		private serial_number: string,
	) {
		super(database);
	}

	/**
	 * Creates a new instance of AirplaneData with the given data. This should primarily be used
	 * when creating a new airplane.
	 * @param database The database to use
	 * @param data The data to use
	 * @returns The new instance
	 */
	static createHolder(db: Database, data: Omit<Airplane, "airplane_id">) {
		return new AirplaneData(
			db,
			0,
			data.serial_number,
			data.manufacturer,
			data.model,
		);
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
		const result = await db.oneOrNone<Airplane | undefined>(
			"SELECT * FROM airplanes WHERE airplane_id = $1",
			[id],
		);
		if (result === undefined) return;

		return plainToInstance(AirplaneData, result);
	}

	static async getAll(db: Database) {
		const result = await db.any<Airplane>("SELECT * FROM airplanes");
		return result.map((data) => plainToInstance(AirplaneData, data));
	}

	async insert() {
		const id = await this.getDatabase().one<number>(
			`INSERT INTO airplanes($1:name)
			VALUES($1:csv)
			RETURNING airplane_id`,
			[
				{
					manufacturer: this.manufacturer,
					model: this.model,
					serial_number: this.serial_number,
				} as Omit<Airplane, "airplane_id">,
			],
		);
		this.airplane_id = id;
	}

	async update(data: Partial<Omit<Airplane, "airplane_id">>) {
		this.manufacturer = data.manufacturer ?? this.manufacturer;
		this.model = data.model ?? this.model;
		this.serial_number = data.serial_number ?? this.serial_number;

		const query = pgp.helpers.update(data, undefined, "airplanes");
		await this.getDatabase().result(`${query} WHERE airplane_id = $1`, [
			this.airplane_id,
		]);
	}

	async delete() {
		await this.getDatabase().result(
			"DELETE FROM airplanes WHERE airplane_id = $1",
			[this.airplane_id],
		);
	}

	getAirplaneId() {
		return this.airplane_id;
	}

	getSerialNumber() {
		return this.serial_number;
	}

	getManufacturer() {
		return this.manufacturer;
	}

	getModel() {
		return this.model;
	}
}
