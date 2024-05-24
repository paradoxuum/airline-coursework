import { DEFAULT_HEADERS, getApiUrl, idSchema } from "@/api/util";
import { z } from "zod";

export const flightSchema = idSchema.extend({
	departure: z.date(),
	arrival: z.date(),
});

const flightStringSchema = idSchema.extend({
	departure: z.string(),
	arrival: z.string(),
});

export type Flight = z.infer<typeof flightSchema>;

const inputSchema = flightSchema.omit({ id: true });
const arraySchema = flightStringSchema.array();

function convertStringSchema(data: z.infer<typeof flightStringSchema>): Flight {
	return {
		...data,
		departure: new Date(data.departure),
		arrival: new Date(data.arrival),
	};
}

export async function getFlights() {
	const res = await fetch(getApiUrl("flight"));
	return arraySchema
		.parse(await res.json())
		.map((flight) => convertStringSchema(flight));
}

export async function getFlight(id: number) {
	const res = await fetch(getApiUrl(`flight/${id}`));
	return flightSchema.parse(await res.json());
}

export async function createFlight(data: z.infer<typeof inputSchema>) {
	const res = await fetch(getApiUrl("flight"), {
		method: "POST",
		body: JSON.stringify(data),
		headers: DEFAULT_HEADERS,
	});
	return idSchema.parse(await res.json()).id;
}

export async function updateFlight(data: z.infer<typeof flightSchema>) {
	await fetch(getApiUrl(`flight/${data.id}`), {
		method: "PATCH",
		body: JSON.stringify(data),
		headers: DEFAULT_HEADERS,
	});
}

export async function deleteFlight(id: number) {
	const res = await fetch(getApiUrl(`flight/${id}`), {
		method: "DELETE",
	});
	return convertStringSchema(flightStringSchema.parse(await res.json()));
}
