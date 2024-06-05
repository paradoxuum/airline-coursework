import { EmployeeData } from "@/actions/db/employee";
import { checkError } from "@/actions/util";
import { db } from "@/db";
import { staffSchema, type Employee, type FullEmployee } from "@/schema";
import { ActionError, defineAction } from "astro:actions";
import { instanceToPlain } from "class-transformer";

async function getFromId(id: number) {
	const data = await EmployeeData.getFromId(db, id);
	if (data === undefined) {
		throw new ActionError({
			code: "NOT_FOUND",
			message: `Employee with id ${id} not found`,
		});
	}
	data.setDatabase(db);
	return data;
}

export const staffActions = {
	getAll: defineAction({
		handler: () =>
			checkError(async () => {
				const employees = await EmployeeData.getAll(db);
				return Promise.all(
					employees.map<Promise<FullEmployee>>(async (employee) => {
						employee.setDatabase(db);
						const flights = await employee.fetchFlights();
						return {
							...(instanceToPlain(employee) as Employee),
							flights,
						};
					}),
				);
			}),
	}),

	get: defineAction({
		accept: "json",
		input: staffSchema.pick({ employee_id: true }),
		handler: (input) =>
			checkError(async () => {
				const data = await getFromId(input.employee_id);
				const flights = await data.fetchFlights();
				return {
					...(instanceToPlain(data) as Employee),
					flights,
				} as FullEmployee;
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
				await data.delete();
				return instanceToPlain(data) as Employee;
			}),
	}),
};
