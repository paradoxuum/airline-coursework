import { ColumnHeader } from "@/components/ColumnHeader";
import { DataTable } from "@/components/DataTable";
import { DeleteDialog } from "@/components/DeleteDialog";
import { FormSheet } from "@/components/FormSheet";
import { FlightActions } from "@/components/flights/FlightActions";
import { FlightForm } from "@/components/flights/FlightForm";
import { Button } from "@/components/ui/Button";
import { useApiMutation } from "@/lib/useApiMutation";
import type { Flight, FullFlight } from "@/schema";
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
	const [currentAction, setCurrentAction] = useState<
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
		getId: (data) => data.flight_id,
		name: "flight",
		key: ["flights"],
	});

	const columns = useMemo<ColumnDef<FullFlight>[]>(
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
				id: "passengers",
				header: ({ column }) => (
					<ColumnHeader column={column} title="# Passengers" />
				),
				cell: ({ row }) => {
					const flight = row.original;
					return <p>{flight.passengers.length}</p>;
				},
			},
			{
				id: "crew",
				header: ({ column }) => <ColumnHeader column={column} title="# Crew" />,
				cell: ({ row }) => {
					const flight = row.original;
					return <p>{flight.crew.length}</p>;
				},
			},
			{
				id: "stops",
				header: ({ column }) => (
					<ColumnHeader column={column} title="# Stops" />
				),
				cell: ({ row }) => {
					const flight = row.original;
					return <p>{flight.stops.length}</p>;
				},
			},
			{
				id: "actions",
				cell: ({ row }) => {
					const flight = row.original;
					return (
						<FlightActions
							data={flight}
							onSelect={(action) => {
								if (action !== "update" && action !== "delete") {
									setCurrentAction(undefined);
									return;
								}

								setCurrentAction({
									type: action,
									flight,
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
				name="flight"
				open={currentAction?.type === "create"}
				onOpenChange={(open) => {
					if (open) return;
					setCurrentAction(undefined);
				}}
			>
				<FlightForm
					onSubmit={(data) => {
						if (mutations.create.isPending) return;
						mutations.create.mutate(data);
						setCurrentAction(undefined);
					}}
				/>
			</FormSheet>

			<FormSheet
				update
				name="flight"
				open={currentAction?.type === "update"}
				onOpenChange={(open) => {
					if (open) return;
					setCurrentAction(undefined);
				}}
			>
				<FlightForm
					defaultValues={currentAction?.flight}
					onSubmit={(data) => {
						const id = currentAction?.flight?.airplane_id;
						if (mutations.update.isPending || id === undefined) return;
						mutations.update.mutate({
							...data,
							flight_id: id,
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
					const id = currentAction?.flight?.flight_id;
					if (mutations.delete.isPending || id === undefined) return;
					mutations.delete.mutate(id);
					setCurrentAction(undefined);
				}}
			/>

			<Button
				className="mb-4"
				variant="outline"
				onClick={() => setCurrentAction({ type: "create" })}
			>
				<Plus size={16} />
				<span>Add Flight</span>
			</Button>

			<DataTable table={table} />
		</>
	);
}
