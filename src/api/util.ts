import { z } from "zod";

export const API_URL = import.meta.env.PUBLIC_API_URL;
export const DEFAULT_HEADERS: HeadersInit = {
	"Content-Type": "application/json",
};

export const idSchema = z.object({ id: z.number().int().positive() });

export const infoSchema = idSchema.extend({
	firstName: z.string().max(50),
	lastName: z.string().max(50),
	address: z.string().max(255),
	phone: z.string().max(15),
});

export function getApiUrl(route: string) {
	return `${API_URL}/${route}`;
}
