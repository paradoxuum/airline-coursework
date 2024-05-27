import { z } from "zod";

const positiveInt = z.number().int().positive();

const infoSchema = z.object({
	first_name: z.string().max(50),
	last_name: z.string().max(50),
	address: z.string().max(255),
	phone: z.string().max(15),
});

export const passengerSchema = infoSchema.extend({
	passenger_id: positiveInt,
});

export const staffSchema = infoSchema.extend({
	employee_id: positiveInt,
	salary: z.number().int().positive(),
});

export const airplaneSchema = z.object({
	airplane_id: positiveInt,
	serial_number: z.string().max(15),
	manufacturer: z.string().max(50),
	model: z.string().max(50),
});

export const airportSchema = z.object({
	airport_id: positiveInt,
	airport_code: z.string().max(3),
});

export const flightSchema = z.object({
	flight_id: positiveInt,
	flight_number: z.string().max(10),
	departure_date: z.string(),
	arrival_date: z.string(),
	airplane_id: positiveInt,
});

export type Passenger = z.infer<typeof passengerSchema>;
export type Employee = z.infer<typeof staffSchema>;
export type Airplane = z.infer<typeof airplaneSchema>;
export type Airport = z.infer<typeof airportSchema>;
export type Flight = z.infer<typeof flightSchema>;
