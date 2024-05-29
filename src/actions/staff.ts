import { EmployeeData } from "@/actions/db/employee";
import { checkError } from "@/actions/util";
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
		handler: () =>
			checkError(async () => {
				return instanceToPlain(await EmployeeData.getAll(db)) as Employee[];
			}),
	}),

	create: defineAction({
		accept: "json",
		input: staffSchema.omit({ employee_id: true }),
		handler: (input) =>
			checkError(async () => {
				const data = EmployeeData.createHolder(db, input);
				await data.insert();
				return instanceToPlain(data) as Employee;
			}),
	}),

	update: defineAction({
		accept: "json",
		input: staffSchema.partial().required({ employee_id: true }),
		handler: (input) =>
			checkError(async () => {
				const data = await getFromId(input.employee_id);
				data.setDatabase(db);
				await data.update({
					first_name: input.first_name,
					last_name: input.last_name,
					address: input.address,
					phone: input.phone,
					salary: input.salary,
				});
				return instanceToPlain(data) as Employee;
			}),
	}),

	delete: defineAction({
		accept: "json",
		input: staffSchema.pick({ employee_id: true }),
		handler: (input) =>
			checkError(async () => {
				const data = await getFromId(input.employee_id);
				data.setDatabase(db);
				await data.delete();
				return instanceToPlain(data) as Employee;
			}),
	}),
};
