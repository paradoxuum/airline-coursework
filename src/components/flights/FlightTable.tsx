import { ColumnHeader } from "@/components/ColumnHeader";
import { DataTable } from "@/components/DataTable";
import { DeleteDialog } from "@/components/DeleteDialog";
import { AddFlight } from "@/components/flights/AddFlight";
import { FlightActions } from "@/components/flights/FlightActions";
import { FlightUpdate } from "@/components/flights/FlightUpdate";
import { Button } from "@/components/ui/Button";
import { useApiMutation } from "@/lib/useApiMutation";
import type { Flight } from "@/schema";
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

export function FlightTable() {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [openDialog, setOpenDialog] = useState<
		{ type: "create" | "delete" | "update"; flight?: Flight } | undefined
	>();

	const query = useQuery(
		{
			queryKey: ["flights"],
			queryFn: actions.flight.getAll,
		},
		client,
	);

	const mutations = useApiMutation<Flight, Omit<Flight, "flight_id">>({
		create: actions.flight.create,
		update: actions.flight.update,
		delete: (id) => actions.flight.delete({ flight_id: id }),
		name: "flight",
		key: ["flights"],
	});

	const columns = useMemo<ColumnDef<Flight>[]>(
		() => [
			{
				accessorKey: "flight_id",
				header: ({ column }) => <ColumnHeader column={column} title="ID" />,
			},
			{
				accessorKey: "flight_number",
				header: ({ column }) => (
					<ColumnHeader column={column} title="Flight Number" />
				),
			},
			{
				accessorKey: "departureDate",
				header: ({ column }) => (
					<ColumnHeader column={column} title="Departure Date" />
				),
				cell: ({ row }) => {
					const departure = row.original.departure_date;
					return <p>{departure.toLocaleString()}</p>;
				},
			},
			{
				accessorKey: "arrivalDate",
				header: ({ column }) => (
					<ColumnHeader column={column} title="Arrival Date" />
				),
				cell: ({ row }) => {
					const arrival = row.original.arrival_date;
					return <p>{arrival.toLocaleString()}</p>;
				},
			},
			{
				accessorKey: "airplane_id",
				header: ({ column }) => (
					<ColumnHeader column={column} title="Airplane ID" />
				),
			},
			{
				id: "actions",
				cell: ({ row }) => {
					const flight = row.original;
					return (
						<FlightActions
							flight={flight}
							onDialogChange={(dialog) =>
								setOpenDialog(
									dialog !== undefined
										? {
												type: dialog,
												flight,
											}
										: undefined,
								)
							}
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
			<AddFlight
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

			<FlightUpdate
				flight={openDialog?.flight}
				onSubmit={(data) => {
					const id = openDialog?.flight?.flight_id;
					if (mutations.update.isPending || id === undefined) return;
					mutations.update.mutate({
						...data,
						flight_id: id,
					});
					setOpenDialog(undefined);
				}}
				open={openDialog?.type === "update"}
				onOpenChange={(open) => {
					if (!open) setOpenDialog(undefined);
				}}
			/>

			<DeleteDialog
				loading={mutations.delete.isPending}
				open={openDialog?.type === "delete"}
				onOpenChange={(open) => {
					if (!open) setOpenDialog(undefined);
				}}
				onConfirm={() => {
					const id = openDialog?.flight?.flight_id;
					if (mutations.delete.isPending || id === undefined) return;
					mutations.delete.mutate(id);
					setOpenDialog(undefined);
				}}
			/>

			<Button
				className="mb-4"
				variant="outline"
				onClick={() => setOpenDialog({ type: "create" })}
			>
				<Plus size={16} />
				<span>Add Flight</span>
			</Button>

			<DataTable table={table} />
		</>
	);
}
