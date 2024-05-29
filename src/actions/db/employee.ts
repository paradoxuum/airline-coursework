import type { DatabaseInteractions } from "@/actions/db/database";
import { PersonData } from "@/actions/db/person";
import { pgp, type Database } from "@/db";
import type { Employee } from "@/schema";
import { Exclude, plainToInstance } from "class-transformer";

export class EmployeeData
	extends PersonData
	implements DatabaseInteractions<EmployeeData, Omit<Employee, "employee_id">>
{
	@Exclude({
		toClassOnly: true,
	})
	private aircraft_ratings: string[] = [];

	constructor(
		database: Database,
		private employee_id: number,
		first_name: string,
		last_name: string,
		address: string,
		phone: string,
		private salary: number,
	) {
		super(database, first_name, last_name, address, phone);
	}

	static createHolder(database: Database, data: Omit<Employee, "employee_id">) {
		return new EmployeeData(
			database,
			0,
			data.first_name,
			data.last_name,
			data.address,
			data.phone,
			data.salary,
		);
	}

	/**
	 * Creates a EmployeeData instance by querying an employee from
	 * the database with the given id.
	 *
	 * @param db The database to use
	 * @param id The id of the employee to get
	 * @returns The instance of the employee
	 */
	static async getFromId(db: Database, id: number) {
		const result = await db.oneOrNone<Employee | undefined>(
			"SELECT * FROM staff WHERE employee_id = $1",
			[id],
		);
		if (result === undefined) return;

		const instance = plainToInstance(EmployeeData, result);
		instance.aircraft_ratings = await EmployeeData.getAircraftRatings(
			db,
			instance.employee_id,
		);
		return instance;
	}

	static async getAll(db: Database) {
		const result = await db.any<Employee>("SELECT * FROM staff");
		return await Promise.all(
			result.map(async (data) => {
				const instance = plainToInstance(EmployeeData, data);
				instance.aircraft_ratings = await EmployeeData.getAircraftRatings(
					db,
					instance.employee_id,
				);
				return instance;
			}),
		);
	}

	static async getAllForFlight(db: Database, flight_id: number) {
		const result = await db.any<Employee>(
			`SELECT * FROM staff
			JOIN flight_staff
				ON staff.employee_id = flight_staff.employee_id
			WHERE flight_staff.flight_id = $1`,
			[flight_id],
		);
		return await Promise.all(
			result.map(async (data) => {
				const instance = plainToInstance(EmployeeData, data);
				instance.aircraft_ratings = await EmployeeData.getAircraftRatings(
					db,
					instance.employee_id,
				);
				return instance;
			}),
		);
	}

	static async getAircraftRatings(db: Database, employeeId: number) {
		return await db.any<string>(
			`SELECT R.aircraft
			FROM pilot_ratings PR
			JOIN aircraft_ratings R
				ON PR.rating_id = R.rating_id
			WHERE PR.employee_id = $1`,
			[employeeId],
		);
	}

	async insert() {
		const id = await this.getDatabase().one<number>(
			`INSERT INTO staff($1:name)
			VALUES($1:csv)
			RETURNING employee_id`,
			[
				{
					first_name: this.first_name,
					last_name: this.last_name,
					address: this.address,
					phone: this.phone,
					salary: this.salary,
				} as Omit<Employee, "employee_id">,
			],
		);
		this.employee_id = id;
	}

	async update(data: Partial<Omit<Employee, "employee_id">>) {
		this.first_name = data.first_name ?? this.first_name;
		this.last_name = data.last_name ?? this.last_name;
		this.address = data.address ?? this.address;
		this.phone = data.phone ?? this.phone;
		this.salary = data.salary ?? this.salary;

		const query = pgp.helpers.update(data, null, "staff");
		await this.getDatabase().result(`${query} WHERE employee_id = $2`, [
			this.employee_id,
		]);
	}

	async delete() {
		await this.getDatabase().result(
			"DELETE FROM staff WHERE employee_id = $1",
			[this.employee_id],
		);
	}

	async addAircraftRating(ratingId: number) {
		const aircraft = await this.getDatabase().oneOrNone<string>(
			"SELECT aircraft FROM aircraft_ratings WHERE rating_id = $1",
			[ratingId],
		);
		if (aircraft === null) {
			throw new Error("Rating not found");
		}

		await this.getDatabase().result(
			"INSERT INTO pilot_ratings(employee_id, rating_id) VALUES($1, $2)",
			[this.employee_id, ratingId],
		);
		this.aircraft_ratings.push(aircraft);
	}

	getEmployeeId() {
		return this.employee_id;
	}

	getSalary() {
		return this.salary;
	}
}
