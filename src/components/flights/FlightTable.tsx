import {
	createFlight,
	deleteFlight,
	getFlights,
	updateFlight,
	type Flight,
} from "@/api";
import { ColumnHeader } from "@/components/ColumnHeader";
import { DataTable } from "@/components/DataTable";
import { DeleteDialog } from "@/components/DeleteDialog";
import { AddFlightButton } from "@/components/flights/AddFlightButton";
import { FlightActions } from "@/components/flights/FlightActions";
import { FlightUpdate } from "@/components/flights/FlightUpdate";
import { useApiMutation } from "@/lib/useApiMutation";
import { client } from "@/stores/app";
import { useQuery } from "@tanstack/react-query";
import {
	getCoreRowModel,
	getSortedRowModel,
	useReactTable,
	type ColumnDef,
	type SortingState,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";

export function FlightTable() {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [openDialog, setOpenDialog] = useState<
		{ type: "delete" | "update"; flight: Flight } | undefined
	>();

	const query = useQuery(
		{
			queryKey: ["flights"],
			queryFn: getFlights,
		},
		client,
	);

	const mutations = useApiMutation<Flight, Omit<Flight, "id">>({
		create: createFlight,
		update: updateFlight,
		delete: deleteFlight,
		name: "flight",
		key: ["flights"],
	});

	const columns = useMemo<ColumnDef<Flight>[]>(
		() => [
			{
				accessorKey: "id",
				header: ({ column }) => {
					return <ColumnHeader column={column} title="ID" />;
				},
			},
			{
				accessorKey: "departureDate",
				header: ({ column }) => {
					return <ColumnHeader column={column} title="Departure Date" />;
				},
				cell: ({ row }) => {
					const departure = row.original.departure;
					return <p>{departure.toLocaleString()}</p>;
				},
			},
			{
				accessorKey: "arrivalDate",
				header: ({ column }) => {
					return <ColumnHeader column={column} title="Arrival Date" />;
				},
				cell: ({ row }) => {
					const arrival = row.original.arrival;
					return <p>{arrival.toLocaleString()}</p>;
				},
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
			<AddFlightButton onSubmit={(data) => mutations.create.mutate(data)} />

			<DeleteDialog
				loading={mutations.delete.isPending}
				open={openDialog?.type === "delete"}
				onOpenChange={(open) => {
					if (!open) setOpenDialog(undefined);
				}}
				onConfirm={() => {
					const id = openDialog?.flight.id;
					if (mutations.delete.isPending || id === undefined) return;
					mutations.delete.mutate(id);
					setOpenDialog(undefined);
				}}
			/>

			<FlightUpdate
				flight={openDialog?.flight}
				onSubmit={(data) => {
					const id = openDialog?.flight.id;
					if (mutations.update.isPending || id === undefined) return;
					mutations.update.mutate({
						...data,
						id,
					});
					setOpenDialog(undefined);
				}}
				open={openDialog?.type === "update"}
				onOpenChange={(open) => {
					if (!open) setOpenDialog(undefined);
				}}
			/>

			<DataTable table={table} />
		</>
	);
}
