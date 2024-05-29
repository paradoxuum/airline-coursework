import type { DatabaseInteractions } from "@/actions/db/database";
import { PersonData } from "@/actions/db/person";
import { pgp, type Database } from "@/db";
import type { Passenger } from "@/schema";
import { plainToInstance } from "class-transformer";

export class PassengerData
	extends PersonData
	implements
		DatabaseInteractions<PassengerData, Omit<Passenger, "passenger_id">>
{
	constructor(
		database: Database,
		private passenger_id: number,
		first_name: string,
		last_name: string,
		address: string,
		phone: string,
	) {
		super(database, first_name, last_name, address, phone);
	}

	/**
	 * Creates a PassengerData instance by querying a passenger from
	 * the database with the given id.
	 *
	 * @param db The database to use
	 * @param id The id of the passenger to get
	 * @returns The instance of the passenger
	 */
	static createHolder(
		database: Database,
		data: Omit<Passenger, "passenger_id">,
	) {
		return new PassengerData(
			database,
			0,
			data.first_name,
			data.last_name,
			data.address,
			data.phone,
		);
	}

	static async getFromId(db: Database, id: number) {
		const result = await db.oneOrNone<Passenger | undefined>(
			"SELECT * FROM passengers WHERE passenger_id = $1",
			[id],
		);
		if (result === undefined) return;

		return plainToInstance(PassengerData, result);
	}

	static async getAll(db: Database) {
		const result = await db.any<Passenger>("SELECT * FROM passengers");
		return result.map((data) => plainToInstance(PassengerData, data));
	}

	static async getAllForFlight(db: Database, flight_id: number) {
		const result = await db.any<Passenger>(
			`SELECT * FROM passengers
			JOIN flight_passengers
				ON passengers.passenger_id = flight_passengers.passenger_id
			WHERE flight_passengers.flight_id = $1`,
			[flight_id],
		);
		return result.map((data) => plainToInstance(PassengerData, data));
	}

	getPassengerId() {
		return this.passenger_id;
	}

	async insert() {
		const id = await this.getDatabase().one<number>(
			`INSERT INTO passengers($1:name)
			VALUES($1:csv)
			RETURNING passenger_id`,
			[
				{
					first_name: this.first_name,
					last_name: this.last_name,
					address: this.address,
					phone: this.phone,
				} as Omit<Passenger, "passenger_id">,
			],
		);
		this.passenger_id = id;
	}

	async update(data: Partial<Omit<Passenger, "passenger_id">>) {
		this.first_name = data.first_name ?? this.first_name;
		this.last_name = data.last_name ?? this.last_name;
		this.address = data.address ?? this.address;
		this.phone = data.phone ?? this.phone;

		const query = pgp.helpers.update(data, undefined, "passengers");
		await this.getDatabase().result(`${query} WHERE passenger_id = $1`, [
			this.passenger_id,
		]);
	}

	async delete() {
		await this.getDatabase().result(
			"DELETE FROM passengers WHERE passenger_id = $1",
			[this.passenger_id],
		);
	}
}
