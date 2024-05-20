import {
	date,
	decimal,
	integer,
	pgTable,
	primaryKey,
	serial,
	varchar,
	type ReferenceConfig,
} from "drizzle-orm/pg-core";

const CASCADE: ReferenceConfig["actions"] = {
	onDelete: "cascade",
	onUpdate: "cascade",
};

export const passengers = pgTable("passengers", {
	id: serial("passenger_id").primaryKey(),
	lastName: varchar("last_name", { length: 50 }).notNull(),
	firstName: varchar("first_name", { length: 50 }).notNull(),
	address: varchar("address", { length: 255 }).notNull(),
	phone: varchar("phone", { length: 15 }).notNull(),
});

export const staff = pgTable("passengers", {
	id: serial("staff_id").primaryKey(),
	lastName: varchar("last_name", { length: 50 }).notNull(),
	firstName: varchar("first_name", { length: 50 }).notNull(),
	address: varchar("address", { length: 255 }).notNull(),
	phone: varchar("phone", { length: 15 }).notNull(),
	salary: decimal("salary", { precision: 10, scale: 2 }).notNull(),
});

export const airplane = pgTable("airplane", {
	id: serial("airplane_id").primaryKey(),
	serial: varchar("serial_number", { length: 50 }).notNull(),
	manufacturer: varchar("manufacturer", { length: 50 }).notNull(),
	model: varchar("model", { length: 50 }).notNull(),
});

export const city = pgTable("city_id", {
	id: serial("city_id").primaryKey(),
	name: varchar("city_name", { length: 50 }).notNull(),
	country: varchar("country", { length: 50 }).notNull(),
});

// Pilot tables
export const pilotRatings = pgTable("pilot_ratings", {
	id: serial("rating_id").primaryKey(),
	aircraft: varchar("aircraft", { length: 50 }).notNull(),
});

export const pilots = pgTable(
	"pilots",
	{
		ratingId: integer("rating_id")
			.notNull()
			.references(() => pilotRatings.id, CASCADE),
		pilotId: integer("pilot_id")
			.notNull()
			.references(() => staff.id, CASCADE),
	},
	(table) => ({
		pk: primaryKey({ columns: [table.ratingId, table.pilotId] }),
	}),
);

// Flight tables
export const flights = pgTable("flights", {
	id: serial("flight_id").primaryKey(),
	departureDate: date("departure_date").notNull(),
	arrivalDate: date("arrival_date").notNull(),
});

export const flightPassengers = pgTable(
	"flight_passengers",
	{
		flightId: integer("flight_id")
			.notNull()
			.references(() => flights.id, CASCADE),
		passengerId: integer("passenger_id")
			.notNull()
			.references(() => passengers.id, CASCADE),
	},
	(table) => ({
		pk: primaryKey({ columns: [table.flightId, table.passengerId] }),
	}),
);

export const flightStaff = pgTable(
	"flight_staff",
	{
		flightId: integer("flight_id")
			.notNull()
			.references(() => flights.id, CASCADE),
		staffId: integer("staff_id")
			.notNull()
			.references(() => staff.id, CASCADE),
	},
	(table) => ({
		pk: primaryKey({ columns: [table.flightId, table.staffId] }),
	}),
);

export const flightCity = pgTable(
	"flight_city",
	{
		flightId: integer("flight_id")
			.notNull()
			.references(() => flights.id, CASCADE),
		cityId: integer("city_id")
			.notNull()
			.references(() => city.id, CASCADE),
		stopNumber: integer("stop_number").notNull(),
	},
	(table) => ({
		pk: primaryKey({ columns: [table.flightId, table.cityId] }),
	}),
);
