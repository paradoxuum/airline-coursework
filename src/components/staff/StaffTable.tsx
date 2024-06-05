import { ActionsDropdown } from "@/components/ActionsDropdown";
import { ColumnHeader } from "@/components/ColumnHeader";
import { DataTable } from "@/components/DataTable";
import { DeleteDialog } from "@/components/DeleteDialog";
import { FormSheet } from "@/components/FormSheet";
import { EmployeeForm } from "@/components/staff/EmployeeForm";
import { Button } from "@/components/ui/Button";
import { useApiMutation } from "@/lib/useApiMutation";
import type { Employee } from "@/schema";
import { client } from "@/stores/app";
import { useQuery } from "@tanstack/react-query";
import {
	getCoreRowModel,
	getSortedRowModel,
	useReactTable,
	type ColumnDef,
	type SortingState,
} from "@tanstack/react-table";
import { actions } from "astro:actions";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";

const SALARY_FORMAT = new Intl.NumberFormat("en-GB", {
	style: "currency",
	currency: "GBP",
});

export function StaffTable() {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [currentAction, setCurrentAction] = useState<
		{ type: "create" | "delete" | "update"; employee?: Employee } | undefined
	>();

	const query = useQuery(
		{
			queryKey: ["staff"],
			queryFn: actions.staff.getAll,
		},
		client,
	);

	const mutations = useApiMutation<Employee, Omit<Employee, "employee_id">>({
		create: actions.staff.create,
		update: actions.staff.update,
		delete: (id) => actions.staff.delete({ employee_id: id }),
		getId: (data) => data.employee_id,
		name: "staff",
		key: ["staff"],
	});

	const columns = useMemo<ColumnDef<Employee>[]>(
		() => [
			{
				accessorKey: "employee_id",
				header: ({ column }) => <ColumnHeader column={column} title="ID" />,
			},
			{
				accessorKey: "first_name",
				header: ({ column }) => (
					<ColumnHeader column={column} title="First Name" />
				),
			},
			{
				accessorKey: "last_name",
				header: ({ column }) => (
					<ColumnHeader column={column} title="Last Name" />
				),
			},
			{
				accessorKey: "phone",
				header: ({ column }) => (
					<ColumnHeader column={column} title="Phone Number" />
				),
			},
			{
				accessorKey: "address",
				header: ({ column }) => (
					<ColumnHeader column={column} title="Address" />
				),
			},
			{
				accessorKey: "salary",
				header: ({ column }) => <ColumnHeader column={column} title="Salary" />,
				cell: ({ row }) => {
					const salary = row.original.salary;
					return <p>{SALARY_FORMAT.format(salary)}</p>;
				},
			},
			{
				id: "actions",
				cell: ({ row }) => {
					const employee = row.original;
					return (
						<ActionsDropdown
							id={employee.employee_id.toString()}
							onSelect={(action) => {
								if (action !== "update" && action !== "delete") {
									setCurrentAction(undefined);
									return;
								}

								setCurrentAction({
									type: action,
									employee,
								});
							}}
						/>
					);
				},
			},
		],
		[],
	);

	const table = useReactTable({
		columns,
		data: query.data ?? [],
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		onSortingChange: setSorting,
		state: {
			sorting,
		},
	});

	return (
		<>
			<FormSheet
				name="employee"
				open={currentAction?.type === "create"}
				onOpenChange={(open) => {
					if (open) return;
					setCurrentAction(undefined);
				}}
			>
				<EmployeeForm
					onSubmit={(data) => {
						if (mutations.create.isPending) return;
						mutations.create.mutate(data);
						setCurrentAction(undefined);
					}}
				/>
			</FormSheet>

			<FormSheet
				update
				name="employee"
				open={currentAction?.type === "update"}
				onOpenChange={(open) => {
					if (open) return;
					setCurrentAction(undefined);
				}}
			>
				<EmployeeForm
					defaultValues={currentAction?.employee}
					onSubmit={(data) => {
						const id = currentAction?.employee?.employee_id;
						if (mutations.update.isPending || id === undefined) return;
						mutations.update.mutate({
							...data,
							employee_id: id,
						});
						setCurrentAction(undefined);
					}}
				/>
			</FormSheet>

			<DeleteDialog
				loading={mutations.delete.isPending}
				open={currentAction?.type === "delete"}
				onOpenChange={(open) => {
					if (!open) setCurrentAction(undefined);
				}}
				onConfirm={() => {
					const id = currentAction?.employee?.employee_id;
					if (mutations.delete.isPending || id === undefined) return;
					mutations.delete.mutate(id);
					setCurrentAction(undefined);
				}}
			/>

			<Button
				className="mb-4"
				variant="outline"
				onClick={() =>
					setCurrentAction({
						type: "create",
					})
				}
			>
				<Plus size={16} />
				<span>Add Employee</span>
			</Button>

			<DataTable table={table} />
		</>
	);
}
