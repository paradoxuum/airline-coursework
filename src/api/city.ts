import { DEFAULT_HEADERS, getApiUrl, idSchema } from "@/api/util";
import { z } from "zod";

export const citySchema = idSchema.extend({
	name: z.string().max(50),
	country: z.string().max(50),
});

export type City = z.infer<typeof citySchema>;

const inputSchema = citySchema.omit({ id: true });
const arraySchema = citySchema.array();

export async function getCities() {
	const res = await fetch(getApiUrl("city"));
	return arraySchema.parse(await res.json());
}

export async function getCity(id: number) {
	const res = await fetch(getApiUrl(`city/${id}`));
	return citySchema.parse(await res.json());
}

export async function createCity(data: z.infer<typeof inputSchema>) {
	const res = await fetch(getApiUrl("city"), {
		method: "POST",
		body: JSON.stringify(data),
		headers: DEFAULT_HEADERS,
	});
	return idSchema.parse(await res.json()).id;
}

export async function updateCity(data: z.infer<typeof citySchema>) {
	await fetch(getApiUrl(`city/${data.id}`), {
		method: "PATCH",
		body: JSON.stringify(data),
		headers: DEFAULT_HEADERS,
	});
}

export async function deleteCity(id: number) {
	const res = await fetch(getApiUrl(`city/${id}`), {
		method: "DELETE",
	});
	return citySchema.parse(await res.json());
}
