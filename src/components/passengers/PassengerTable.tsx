import { ColumnHeader } from "@/components/ColumnHeader";
import { DataTable } from "@/components/DataTable";
import { DeleteDialog } from "@/components/DeleteDialog";
import { AddPassenger } from "@/components/passengers/AddPassenger";
import { PassengerActions } from "@/components/passengers/PassengerActions";
import { PassengerUpdate } from "@/components/passengers/PassengerUpdate";
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
	const [openDialog, setOpenDialog] = useState<
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
						<PassengerActions
							passenger={passenger}
							onDialogChange={(dialog) => {
								setOpenDialog(
									dialog !== undefined
										? {
												type: dialog,
												passenger,
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
			<AddPassenger
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

			<PassengerUpdate
				passenger={openDialog?.passenger}
				open={openDialog?.type === "update"}
				onOpenChange={(open) => {
					if (!open) setOpenDialog(undefined);
				}}
				onSubmit={(data) => {
					const id = openDialog?.passenger?.passenger_id;
					if (mutations.update.isPending || id === undefined) return;
					mutations.update.mutate({
						...data,
						passenger_id: id,
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
					const id = openDialog?.passenger?.passenger_id;
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
				<span>Add Passenger</span>
			</Button>

			<DataTable table={table} />
		</>
	);
}
