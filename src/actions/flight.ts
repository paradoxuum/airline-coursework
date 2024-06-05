import { AirportData } from "@/actions/db/airport";
import { EmployeeData } from "@/actions/db/employee";
import { FlightData } from "@/actions/db/flight";
import { PassengerData } from "@/actions/db/passenger";
import { checkError } from "@/actions/util";
import { db } from "@/db";
import {
	airportSchema,
	flightSchema,
	passengerSchema,
	staffSchema,
	type Flight,
	type FullFlight,
} from "@/schema";
import { ActionError, defineAction } from "astro:actions";
import { instanceToPlain } from "class-transformer";

async function getFromId(id: number) {
	const data = await FlightData.getFromId(db, id);
	if (data === undefined) {
		throw new ActionError({
			code: "NOT_FOUND",
			message: `Flight with id ${id} not found`,
		});
	}
	data.setDatabase(db);
	return data;
}

async function getPassenger(id: number) {
	const data = await PassengerData.getFromId(db, id);
	if (data === undefined) {
		throw new ActionError({
			code: "NOT_FOUND",
			message: `Passenger with id ${id} not found`,
		});
	}
	data.setDatabase(db);
	return data;
}

async function getEmployee(id: number) {
	const data = await EmployeeData.getFromId(db, id);
	if (data === undefined) {
		throw new ActionError({
			code: "NOT_FOUND",
			message: `Employee with id ${id} not found`,
		});
	}
	data.setDatabase(db);
	return data;
}

async function getAirport(id: number) {
	const data = await AirportData.getFromId(db, id);
	if (data === undefined) {
		throw new ActionError({
			code: "NOT_FOUND",
			message: `Airport with id ${id} not found`,
		});
	}
	data.setDatabase(db);
	return data;
}

export const flightActions = {
	getAll: defineAction({
		handler: () =>
			checkError(async () => {
				return instanceToPlain(await FlightData.getAll(db)) as FullFlight[];
			}),
	}),

	get: defineAction({
		accept: "json",
		input: flightSchema.pick({ flight_id: true }),
		handler: (input) =>
			checkError(async () => {
				const data = await getFromId(input.flight_id);
				return instanceToPlain(data) as FullFlight;
			}),
	}),

	create: defineAction({
		accept: "json",
		input: flightSchema.omit({ flight_id: true }),
		handler: (input) =>
			checkError(async () => {
				const data = FlightData.createHolder(db, input);
				await data.insert();
				return instanceToPlain(data) as Flight;
			}),
	}),

	update: defineAction({
		accept: "json",
		input: flightSchema.partial().required({ flight_id: true }),
		handler: (input) =>
			checkError(async () => {
				const data = await getFromId(input.flight_id);
				await data.update({
					arrival_date: input.arrival_date,
					departure_date: input.departure_date,
					flight_number: input.flight_number,
					airplane_id: input.airplane_id,
				});
				return instanceToPlain(data) as Flight;
			}),
	}),

	delete: defineAction({
		accept: "json",
		input: flightSchema.pick({ flight_id: true }),
		handler: (input) =>
			checkError(async () => {
				const data = await getFromId(input.flight_id);
				await data.delete();
				return instanceToPlain(data) as Flight;
			}),
	}),

	addPassenger: defineAction({
		accept: "json",
		input: flightSchema
			.pick({ flight_id: true })
			.merge(passengerSchema.pick({ passenger_id: true })),
		handler: (input) =>
			checkError(async () => {
				const flight = await getFromId(input.flight_id);
				const passenger = await getPassenger(input.passenger_id);
				await flight.addPassenger(passenger);
			}),
	}),

	removePassenger: defineAction({
		accept: "json",
		input: flightSchema
			.pick({ flight_id: true })
			.merge(passengerSchema.pick({ passenger_id: true })),
		handler: (input) =>
			checkError(async () => {
				const flight = await getFromId(input.flight_id);
				const passenger = await getPassenger(input.passenger_id);
				await flight.removePassenger(passenger);
			}),
	}),

	addEmployee: defineAction({
		accept: "json",
		input: flightSchema
			.pick({ flight_id: true })
			.merge(staffSchema.pick({ employee_id: true })),
		handler: (input) =>
			checkError(async () => {
				const flight = await getFromId(input.flight_id);
				const employee = await getEmployee(input.employee_id);
				await flight.addEmployee(employee);
			}),
	}),

	removeEmployee: defineAction({
		accept: "json",
		input: flightSchema
			.pick({ flight_id: true })
			.merge(staffSchema.pick({ employee_id: true })),
		handler: (input) =>
			checkError(async () => {
				const flight = await getFromId(input.flight_id);
				const employee = await getEmployee(input.employee_id);
				await flight.removeEmployee(employee);
			}),
	}),

	addStop: defineAction({
		accept: "json",
		input: flightSchema
			.pick({ flight_id: true })
			.merge(airportSchema.pick({ airport_id: true })),
		handler: (input) =>
			checkError(async () => {
				const flight = await getFromId(input.flight_id);
				const airport = await getAirport(input.airport_id);
				await flight.addStop(airport);
			}),
	}),

	removeStop: defineAction({
		accept: "json",
		input: flightSchema
			.pick({ flight_id: true })
			.merge(airportSchema.pick({ airport_id: true })),
		handler: (input) =>
			checkError(async () => {
				const flight = await getFromId(input.flight_id);
				const airport = await getAirport(input.airport_id);
				await flight.removeStop(airport);
			}),
	}),
};
