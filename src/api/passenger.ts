import { DEFAULT_HEADERS, getApiUrl, idSchema, infoSchema } from "@/api/util";
import type { z } from "zod";

export const passengerSchema = infoSchema.extend({});

export type Passenger = z.infer<typeof passengerSchema>;

const arraySchema = passengerSchema.array();
const inputSchema = passengerSchema.omit({ id: true });

export async function getPassengers() {
	const res = await fetch(getApiUrl("passenger"));
	return arraySchema.parse(await res.json());
}

export async function getPassenger(id: number) {
	const res = await fetch(getApiUrl(`passenger/${id}`));
	return passengerSchema.parse(await res.json());
}

export async function createPassenger(data: z.infer<typeof inputSchema>) {
	const res = await fetch(getApiUrl("passenger"), {
		method: "POST",
		body: JSON.stringify(data),
		headers: DEFAULT_HEADERS,
	});
	return idSchema.parse(await res.json()).id;
}

export async function updatePassenger(data: z.infer<typeof passengerSchema>) {
	await fetch(getApiUrl(`passenger/${data.id}`), {
		method: "PATCH",
		body: JSON.stringify(data),
		headers: DEFAULT_HEADERS,
	});
}

export async function deletePassenger(id: number) {
	const res = await fetch(getApiUrl(`passenger/${id}`), {
		method: "DELETE",
	});
	return passengerSchema.parse(await res.json());
}
