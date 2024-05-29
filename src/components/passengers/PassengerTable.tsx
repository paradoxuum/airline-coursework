import { ActionsDropdown } from "@/components/ActionsDropdown";
import { ColumnHeader } from "@/components/ColumnHeader";
import { DataTable } from "@/components/DataTable";
import { DeleteDialog } from "@/components/DeleteDialog";
import { FormSheet } from "@/components/FormSheet";
import { PassengerForm } from "@/components/passengers/PassengerForm";
import { Button } from "@/components/ui/Button";
import { useApiMutation } from "@/lib/useApiMutation";
import type { Passenger } from "@/schema";
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

export function PassengerTable() {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [currentAction, setCurrentAction] = useState<
		{ type: "create" | "delete" | "update"; passenger?: Passenger } | undefined
	>();

	const query = useQuery(
		{
			queryKey: ["passengers"],
			queryFn: actions.passenger.getAll,
		},
		client,
	);

	const mutations = useApiMutation<Passenger, Omit<Passenger, "passenger_id">>({
		create: actions.passenger.create,
		update: actions.passenger.update,
		delete: (id) => actions.passenger.delete({ passenger_id: id }),
		getId: (data) => data.passenger_id,
		name: "passenger",
		key: ["passengers"],
	});

	const columns = useMemo<ColumnDef<Passenger>[]>(
		() => [
			{
				accessorKey: "passenger_id",
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
				id: "actions",
				cell: ({ row }) => {
					const passenger = row.original;
					return (
						<ActionsDropdown
							id={passenger.passenger_id.toString()}
							onSelect={(action) => {
								if (action !== "update" && action !== "delete") {
									setCurrentAction(undefined);
									return;
								}

								setCurrentAction({
									type: action,
									passenger,
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
				name="passenger"
				open={currentAction?.type === "create"}
				onOpenChange={(open) => {
					if (open) return;
					setCurrentAction(undefined);
				}}
			>
				<PassengerForm
					onSubmit={(data) => {
						if (mutations.create.isPending) return;
						mutations.create.mutate(data);
						setCurrentAction(undefined);
					}}
				/>
			</FormSheet>

			<FormSheet
				update
				name="passenger"
				open={currentAction?.type === "update"}
				onOpenChange={(open) => {
					if (open) return;
					setCurrentAction(undefined);
				}}
			>
				<PassengerForm
					defaultValues={currentAction?.passenger}
					onSubmit={(data) => {
						const id = currentAction?.passenger?.passenger_id;
						if (mutations.update.isPending || id === undefined) return;
						mutations.update.mutate({
							...data,
							passenger_id: id,
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
					const id = currentAction?.passenger?.passenger_id;
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
				<span>Add Passenger</span>
			</Button>

			<DataTable table={table} />
		</>
	);
}
