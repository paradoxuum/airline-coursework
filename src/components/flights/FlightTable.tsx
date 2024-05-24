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
import { client } from "@/stores/app";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
	getCoreRowModel,
	getSortedRowModel,
	useReactTable,
	type ColumnDef,
	type SortingState,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { toast } from "sonner";

export function FlightTable() {
	const query = useQuery(
		{
			queryKey: ["flights"],
			queryFn: getFlights,
		},
		client,
	);

	const createMutation = useMutation(
		{
			mutationFn: createFlight,
			onSuccess: (id) => {
				toast.success(`Flight ${id} created`);
				client.invalidateQueries({ queryKey: ["flights"] });
			},
			onError: (err) => {
				toast.error("Failed to create flight");
				console.error("Failed to create flight", err);
			},
		},
		client,
	);

	const updateMutation = useMutation(
		{
			mutationFn: updateFlight,
			onSuccess: (_, input) => {
				toast.success(`Flight ${input.id} updated`);
				client.invalidateQueries({ queryKey: ["flights"] });
			},
			onError: (err, input) => {
				toast.error(`Failed to update flight ${input.id}`);
				console.error("Failed to update flight", err);
			},
		},
		client,
	);

	const deleteMutation = useMutation(
		{
			mutationFn: deleteFlight,
			onSuccess: (_, id) => {
				toast.success(`Flight ${id} deleted`);
				client.invalidateQueries({ queryKey: ["flights"] });
			},
			onError: (err, id) => {
				toast.error(`Failed to delete flight ${id}`);
				console.error("Failed to delete flight", err);
			},
		},
		client,
	);

	const [sorting, setSorting] = useState<SortingState>([]);
	const [openDialog, setOpenDialog] = useState<
		{ type: "delete" | "update"; flight: Flight } | undefined
	>();

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
			<AddFlightButton onSubmit={(data) => createMutation.mutate(data)} />

			<DeleteDialog
				loading={deleteMutation.isPending}
				open={openDialog?.type === "delete"}
				onOpenChange={(open) => {
					if (!open) setOpenDialog(undefined);
				}}
				onConfirm={() => {
					const id = openDialog?.flight.id;
					if (deleteMutation.isPending || id === undefined) return;
					deleteMutation.mutate(id);
					setOpenDialog(undefined);
				}}
			/>

			<FlightUpdate
				flight={openDialog?.flight}
				onSubmit={(data) => {
					const id = openDialog?.flight.id;
					if (updateMutation.isPending || id === undefined) return;
					updateMutation.mutate({
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
