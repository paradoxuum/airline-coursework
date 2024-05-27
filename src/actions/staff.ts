import { EmployeeData } from "@/actions/db/employee";
import { db } from "@/db";
import { staffSchema, type Employee } from "@/schema";
import { ActionError, defineAction } from "astro:actions";
import { instanceToPlain } from "class-transformer";

async function getFromId(id: number) {
	const employee = await EmployeeData.getFromId(db, id);
	if (employee === undefined) {
		throw new ActionError({
			code: "NOT_FOUND",
			message: `Employee with id ${id} not found`,
		});
	}
	return employee;
}

export const staffActions = {
	getAll: defineAction({
		handler: async () => {
			return instanceToPlain(await EmployeeData.getAll(db)) as Employee[];
		},
	}),

	create: defineAction({
		accept: "json",
		input: staffSchema.omit({ employee_id: true }),
		handler: async (input) => {
			return EmployeeData.createHolder(db, input).insert();
		},
	}),

	update: defineAction({
		accept: "json",
		input: staffSchema.partial().required({ employee_id: true }),
		handler: async (input) => {
			const data = await getFromId(input.employee_id);
			data.setDatabase(db);
			await data.update(input);
		},
	}),

	delete: defineAction({
		accept: "json",
		input: staffSchema.pick({ employee_id: true }),
		handler: async (input) => {
			const data = await getFromId(input.employee_id);
			data.setDatabase(db);
			await data.delete();
		},
	}),
};
