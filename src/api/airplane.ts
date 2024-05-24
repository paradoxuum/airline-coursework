import { DEFAULT_HEADERS, getApiUrl, idSchema } from "@/api/util";
import { z } from "zod";

export const airplaneSchema = idSchema.extend({
	serial: z.string().max(50),
	manufacturer: z.string().max(50),
	model: z.string().max(50),
});

export type Airplane = z.infer<typeof airplaneSchema>;

const inputSchema = airplaneSchema.omit({ id: true });
const arraySchema = airplaneSchema.array();

export async function getAirplanes() {
	const res = await fetch(getApiUrl("airplane"));
	return arraySchema.parse(await res.json());
}

export async function getAirplane(id: number) {
	const res = await fetch(getApiUrl(`airplane/${id}`));
	return airplaneSchema.parse(await res.json());
}

export async function createAirplane(data: z.infer<typeof inputSchema>) {
	const res = await fetch(getApiUrl("airplane"), {
		method: "POST",
		body: JSON.stringify(data),
		headers: DEFAULT_HEADERS,
	});
	return idSchema.parse(await res.json()).id;
}

export async function updateAirplane(data: z.infer<typeof airplaneSchema>) {
	await fetch(getApiUrl(`airplane/${data.id}`), {
		method: "PATCH",
		body: JSON.stringify(data),
		headers: DEFAULT_HEADERS,
	});
}

export async function deleteAirplane(id: number) {
	const res = await fetch(getApiUrl(`airplane/${id}`), {
		method: "DELETE",
	});
	return airplaneSchema.parse(await res.json());
}
