import type { AirportData } from "@/actions/db/airport";
import {
	DatabaseHolder,
	type DatabaseInteractions,
} from "@/actions/db/database";
import { EmployeeData } from "@/actions/db/employee";
import { PassengerData } from "@/actions/db/passenger";
import { pgp, type Database } from "@/db";
import type { Flight } from "@/schema";
import { Exclude, plainToInstance } from "class-transformer";

export class FlightData
	extends DatabaseHolder
	implements DatabaseInteractions<FlightData, Omit<Flight, "flight_id">>
{
	private departure_date: Date;
	private arrival_date: Date;

	@Exclude({ toClassOnly: true })
	private passengers: PassengerData[] = [];

	@Exclude({ toClassOnly: true })
	private crew: EmployeeData[] = [];

	@Exclude({ toClassOnly: true })
	private stops: string[] = [];

	constructor(
		database: Database,
		private flight_id: number,
		private flight_number: string,
		departure_date: string,
		arrival_date: string,
		private airplane_id: number,
	) {
		super(database);
		this.departure_date = new Date(departure_date);
		this.arrival_date = new Date(arrival_date);
	}

	/**
	 * Creates a new instance of FlightData with the given data. This should primarily be used
	 * when creating a new flight.
	 * @param database The database to use
	 * @param data The data to use
	 * @returns The new instance
	 */
	static createHolder(database: Database, data: Omit<Flight, "flight_id">) {
		return new FlightData(
			database,
			0,
			data.flight_number,
			data.departure_date,
			data.arrival_date,
			data.airplane_id,
		);
	}

	/**
	 * Creates a FlightData instance by querying a flight from
	 * the database with the given id.
	 *
	 * @param db The database to use
	 * @param id The id of the flight to get
	 * @returns The instance of the flight
	 */
	static async getFromId(db: Database, id: number) {
		const result = await db.oneOrNone<Flight | undefined>(
			"SELECT * FROM flights WHERE flight_id = $1",
			[id],
		);
		if (result === undefined) return;

		const instance = plainToInstance(FlightData, result);
		await FlightData.populateFields(db, instance);
		return instance;
	}

	/**
	 * Returns all flights in the database.
	 * @param db The database to use
	 * @returns All flights in the database
	 */
	static async getAll(db: Database) {
		const result = await db.any<Flight>("SELECT * FROM flights");
		return Promise.all(
			result.map(async (data) => {
				const instance = plainToInstance(FlightData, data);
				await FlightData.populateFields(db, instance);
				return instance;
			}),
		);
	}

	private static async populateFields(db: Database, flight: FlightData) {
		// Populate passengers and crew fields for the flight
		// by querying bridge tables
		flight.passengers = await PassengerData.getAllForFlight(
			db,
			flight.getFlightId(),
		);
		flight.crew = await EmployeeData.getAllForFlight(db, flight.getFlightId());

		const stops = await db.any<string>(
			`SELECT A.airport_code
			FROM flight_stops FS
			JOIN airports A
				ON FS.airport_id = A.airport_id
			WHERE FS.flight_id = $1`,
			[flight.getFlightId()],
		);
		flight.stops = stops;
	}

	async insert() {
		const data = await this.getDatabase().one<Flight>(
			`INSERT INTO flights($1:name)
			VALUES($1:csv)
			RETURNING *`,
			[
				{
					flight_number: this.flight_number,
					arrival_date: this.arrival_date.toISOString(),
					departure_date: this.departure_date.toISOString(),
					airplane_id: this.airplane_id,
				} as Omit<Flight, "flight_id">,
			],
		);
		this.flight_id = data.flight_id;
	}

	async update(data: Partial<Omit<Flight, "flight_id">>) {
		this.flight_number = data.flight_number ?? this.flight_number;
		this.departure_date =
			data.departure_date !== undefined
				? new Date(data.departure_date)
				: this.departure_date;
		this.arrival_date =
			data.arrival_date !== undefined
				? new Date(data.arrival_date)
				: this.arrival_date;
		this.airplane_id = data.airplane_id ?? this.airplane_id;

		const query = pgp.helpers.update(data, undefined, "flights");
		await this.getDatabase().result(`${query} WHERE flight_id = $1`, [
			this.flight_id,
		]);
	}

	async delete() {
		await this.getDatabase().result(
			"DELETE FROM flights WHERE flight_id = $1",
			[this.flight_id],
		);
	}

	/**
	 * Adds a passenger to the flight.
	 * @param passenger The passenger to add
	 */
	async addPassenger(passenger: PassengerData) {
		if (
			this.passengers.some(
				(p) => p.getPassengerId() === passenger.getPassengerId(),
			)
		) {
			return;
		}

		await this.getDatabase().result(
			`INSERT INTO flight_passengers(flight_id, passenger_id)
			VALUES($1, $2)`,
			[this.flight_id, passenger.getPassengerId()],
		);
		this.passengers.push(passenger);
	}

	/**
	 * Adds an employee to the flight.
	 * @param employee The employee to add
	 */
	async addEmployee(employee: EmployeeData) {
		if (this.crew.some((p) => p.getEmployeeId() === employee.getEmployeeId())) {
			return;
		}

		await this.getDatabase().result(
			`INSERT INTO flight_staff(flight_id, employee_id)
			VALUES($1, $2)`,
			[this.flight_id, employee.getEmployeeId()],
		);
		this.crew.push(employee);
	}

	/**
	 * Adds a stop to the flight.
	 * @param airport The airport to add
	 */
	async addStop(airport: AirportData) {
		if (this.stops.includes(airport.getAirportCode())) return;

		await this.getDatabase().result(
			`INSERT INTO flight_stops(flight_id, airport_id)
			VALUES($1, $2)`,
			[this.flight_id, airport.getAirportId()],
		);
		this.stops.push(airport.getAirportCode());
	}

	/**
	 * Removes a passenger from the flight.
	 * @param passenger The passenger to remove
	 */
	async removePassenger(passenger: PassengerData) {
		await this.getDatabase().result(
			"DELETE FROM flight_passengers WHERE flight_id = $1 AND passenger_id = $2",
			[this.flight_id, passenger.getPassengerId()],
		);
		this.passengers = this.passengers.filter(
			(p) => p.getPassengerId() !== passenger.getPassengerId(),
		);
	}

	/**
	 * Removes an employee from the flight.
	 * @param employee The employee to remove
	 */
	async removeEmployee(employee: EmployeeData) {
		await this.getDatabase().result(
			"DELETE FROM flight_staff WHERE flight_id = $1 AND employee_id = $2",
			[this.flight_id, employee.getEmployeeId()],
		);
		this.crew = this.crew.filter(
			(p) => p.getEmployeeId() !== employee.getEmployeeId(),
		);
	}

	/**
	 * Removes a stop from the flight.
	 * @param airport The airport to remove
	 */
	async removeStop(airport: AirportData) {
		if (!this.stops.includes(airport.getAirportCode())) return;

		await this.getDatabase().result(
			"DELETE FROM flight_stops WHERE flight_id = $1 AND airport_id = $2",
			[this.flight_id, airport.getAirportId()],
		);
		this.stops = this.stops.filter((s) => s !== airport.getAirportCode());
	}

	getFlightId() {
		return this.flight_id;
	}

	getFlightNumber() {
		return this.flight_number;
	}

	getDepartureDate() {
		return this.departure_date;
	}

	getArrivalDate() {
		return this.arrival_date;
	}

	getAirplaneId() {
		return this.airplane_id;
	}

	getPassengers() {
		return this.passengers;
	}

	getCrew() {
		return this.crew;
	}

	getStops() {
		return this.stops;
	}
}
