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
	/**
	 * Inserts the entity into the database.
	 */
	insert(data: T): Promise<void>;

	/**
	 * Updates the entity with the given data.
	 * @param data The data to update the entity with
	 */
	update(data: Partial<I>): Promise<void>;

	/**
	 * Deletes the entity from the database.
	 */
	delete(): Promise<void>;
}
