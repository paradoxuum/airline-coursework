import { ColumnHeader } from "@/components/ColumnHeader";
import { DataTable } from "@/components/DataTable";
import { DeleteDialog } from "@/components/DeleteDialog";
import { AddEmployee } from "@/components/staff/AddEmployee";
import { EmployeeActions } from "@/components/staff/EmployeeActions";
import { EmployeeUpdate } from "@/components/staff/EmployeeUpdate";
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
	const [openDialog, setOpenDialog] = useState<
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
				header: ({ column }) => (
					<ColumnHeader column={column} title="Address" />
				),
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
						<EmployeeActions
							employee={employee}
							onDialogChange={(dialog) => {
								setOpenDialog(
									dialog !== undefined
										? {
												type: dialog,
												employee,
											}
										: undefined,
								);
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
			<AddEmployee
				open={openDialog?.type === "create"}
				onOpenChange={(open) => {
					if (!open) setOpenDialog(undefined);
				}}
				onSubmit={(data) => {
					if (mutations.create.isPending) return;
					mutations.create.mutate(data);
					setOpenDialog(undefined);
				}}
			/>

			<EmployeeUpdate
				employee={openDialog?.employee}
				open={openDialog?.type === "update"}
				onOpenChange={(open) => {
					if (!open) setOpenDialog(undefined);
				}}
				onSubmit={(data) => {
					const id = openDialog?.employee?.employee_id;
					if (mutations.update.isPending || id === undefined) return;
					mutations.update.mutate({
						...data,
						employee_id: id,
					});
					setOpenDialog(undefined);
				}}
			/>

			<DeleteDialog
				loading={mutations.delete.isPending}
				open={openDialog?.type === "delete"}
				onOpenChange={(open) => {
					if (!open) setOpenDialog(undefined);
				}}
				onConfirm={() => {
					const id = openDialog?.employee?.employee_id;
					if (mutations.delete.isPending || id === undefined) return;
					mutations.delete.mutate(id);
					setOpenDialog(undefined);
				}}
			/>

			<Button
				className="mb-4"
				variant="outline"
				onClick={() =>
					setOpenDialog({
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
