import { DEFAULT_HEADERS, getApiUrl, infoSchema } from "@/api/util";
import { z } from "zod";

export const staffSchema = infoSchema.extend({
	salary: z.number().positive(),
});

export type Staff = z.infer<typeof staffSchema>;

const inputSchema = staffSchema.omit({ id: true });
const arraySchema = staffSchema.array();

export async function getEmployees() {
	const res = await fetch(getApiUrl("staff"));
	return arraySchema.parse(await res.json());
}

export async function getEmployee(id: number) {
	const res = await fetch(getApiUrl(`staff/${id}`));
	return staffSchema.parse(await res.json());
}

export async function createEmployee(data: z.infer<typeof inputSchema>) {
	const res = await fetch(getApiUrl("staff"), {
		method: "POST",
		body: JSON.stringify(data),
		headers: DEFAULT_HEADERS,
	});
	return infoSchema.parse(await res.json()).id;
}

export async function updateEmployee(data: z.infer<typeof staffSchema>) {
	await fetch(getApiUrl(`staff/${data.id}`), {
		method: "PATCH",
		body: JSON.stringify(data),
		headers: DEFAULT_HEADERS,
	});
}

export async function deleteEmployee(id: number) {
	const res = await fetch(getApiUrl(`staff/${id}`), {
		method: "DELETE",
	});
	return staffSchema.parse(await res.json());
}
