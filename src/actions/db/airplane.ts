import {
	DatabaseHolder,
	type DatabaseInteractions,
} from "@/actions/db/database";
import type { Database } from "@/db";
import type { Airplane } from "@/schema";
import { plainToInstance } from "class-transformer";

export class AirplaneData
	extends DatabaseHolder
	implements DatabaseInteractions<AirplaneData, Omit<Airplane, "airplane_id">>
{
	constructor(
		database: Database,
		private readonly airplane_id: number,
		private serial_number: string,
		private manufacturer: string,
		private model: string,
	) {
		super(database);
	}

	static createHolder(db: Database, data: Omit<Airplane, "airplane_id">) {
		return new AirplaneData(
			db,
			0,
			data.serial_number,
			data.manufacturer,
			data.model,
		);
	}

	static async getFromId(db: Database, id: number) {
		const result = db.oneOrNone<Airplane | undefined>(
			"SELECT * FROM airplanes WHERE airplane_id = $1",
			[id],
		);
		if (result === undefined) return;

		return plainToInstance(AirplaneData, result);
	}

	static async getAll(db: Database) {
		const result = await db.any<Airplane>("SELECT * FROM flights");
		return result.map((data) => plainToInstance(AirplaneData, data));
	}

	async insert() {
		return this.getDatabase().one<number>(
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
	}

	async update(data: Partial<Omit<Airplane, "airplane_id">>) {
		this.manufacturer = data.manufacturer ?? this.manufacturer;
		this.model = data.model ?? this.model;
		this.serial_number = data.serial_number ?? this.serial_number;
		await this.getDatabase().result(
			"UPDATE airplanes SET $1:name WHERE airplane_id = $2",
			[data, this.airplane_id],
		);
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
