import { ActionError } from "astro:actions";

export function checkError<T>(callback: () => T): T {
	try {
		return callback();
	} catch (e) {
		console.error(e);
		throw new ActionError({
			code: "INTERNAL_SERVER_ERROR",
			message: "An error occurred",
		});
	}
}
