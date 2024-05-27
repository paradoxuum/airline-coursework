import { DatabaseHolder } from "@/actions/db/database";
import type { Database } from "@/db";

export abstract class PersonData extends DatabaseHolder {
	constructor(
		database: Database,
		protected first_name: string,
		protected last_name: string,
		protected address: string,
		protected phone: string,
	) {
		super(database);
	}

	getFirstName() {
		return this.first_name;
	}

	getLastName() {
		return this.last_name;
	}

	getAddress() {
		return this.address;
	}

	getPhone() {
		return this.phone;
	}
}
