import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function getResponse(status: number, body: unknown) {
	return new Response(JSON.stringify(body), {
		status,
		headers: {
			"Content-Type": "application/json",
		},
	});
}

export function capitalize(text: string) {
	return text.charAt(0).toUpperCase() + text.slice(1);
}
