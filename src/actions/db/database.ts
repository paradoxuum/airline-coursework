import type { Database } from "@/db";
import { Exclude } from "class-transformer";

export abstract class DatabaseHolder {
	@Exclude()
	private database?: Database;

	constructor(database: Database) {
		this.database = database;
	}

	getDatabase() {
		if (this.database === undefined) throw new Error("Database not set");
		return this.database;
	}

	setDatabase(database: Database) {
		this.database = database;
	}
}

export interface DatabaseInteractions<T, I> {
	insert(data: T): Promise<number>;
	update(data: Partial<I>): Promise<void>;
	delete(): Promise<void>;
}
