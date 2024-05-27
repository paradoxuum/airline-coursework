import type { DatabaseInteractions } from "@/actions/db/database";
import { PersonData } from "@/actions/db/person";
import type { Database } from "@/db";
import type { Employee } from "@/schema";
import { plainToInstance } from "class-transformer";

export class EmployeeData
	extends PersonData
	implements DatabaseInteractions<EmployeeData, Omit<Employee, "employee_id">>
{
	constructor(
		database: Database,
		private readonly employee_id: number,
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

	static async getFromId(db: Database, id: number) {
		const result = db.oneOrNone<Employee | undefined>(
			"SELECT * FROM staff WHERE employee_id = $1",
			[id],
		);
		if (result === undefined) return;

		return plainToInstance(EmployeeData, result);
	}

	static async getAll(db: Database) {
		const result = await db.any<Employee>("SELECT * FROM staff");
		return result.map((data) => plainToInstance(EmployeeData, data));
	}

	async insert() {
		return this.getDatabase().one<number>(
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
	}

	async update(data: Partial<Omit<Employee, "employee_id">>) {
		this.first_name = data.first_name ?? this.first_name;
		this.last_name = data.last_name ?? this.last_name;
		this.address = data.address ?? this.address;
		this.phone = data.phone ?? this.phone;
		this.salary = data.salary ?? this.salary;
		await this.getDatabase().result(
			"UPDATE staff SET $1:name WHERE employee_id = $2",
			[data, this.employee_id],
		);
	}

	async delete() {
		await this.getDatabase().result(
			"DELETE FROM staff WHERE employee_id = $1",
			[this.employee_id],
		);
	}

	getEmployeeId() {
		return this.employee_id;
	}

	getSalary() {
		return this.salary;
	}
}
