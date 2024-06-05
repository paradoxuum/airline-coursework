import { ColumnHeader } from "@/components/ColumnHeader";
import { DataTable } from "@/components/DataTable";
import { AssignDialog } from "@/components/details/AssignDialog";
import { RemoveAction } from "@/components/details/RemoveAction";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import type { Airport, Employee, Passenger } from "@/schema";
import { client } from "@/stores/app";
import { useMutation, useQuery } from "@tanstack/react-query";
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
import { toast } from "sonner";

type Action = "add" | "update" | "delete";

interface SelectedPassenger {
	type: "passenger";
	data?: Passenger;
	action: Action;
}

interface SelectedEmployee {
	type: "employee";
	data?: Employee;
	action: Action;
}

interface SelectedStop {
	type: "airport";
	data?: Airport;
	action: Action;
}

type SelectedState = SelectedPassenger | SelectedEmployee | SelectedStop;

export function FlightDetails({ id }: { id: number }) {
	const [selected, setSelected] = useState<SelectedState | undefined>();
	const [passengerSorting, setPassengerSorting] = useState<SortingState>([]);
	const [crewSorting, setCrewSorting] = useState<SortingState>([]);
	const [stopSorting, setStopSorting] = useState<SortingState>([]);

	const query = useQuery(
		{
			queryKey: ["flights", id.toString()],
			queryFn: () => actions.flight.get({ flight_id: id }),
		},
		client,
	);

	const addPassengerMutation = useMutation(
		{
			mutationFn: (passengerId: number) =>
				actions.flight.addPassenger({
					flight_id: id,
					passenger_id: passengerId,
				}),
			onSuccess: () => {
				toast.success("Successfully added passenger to flight");
				client.invalidateQueries({
					queryKey: ["flights"],
				});
			},
			onError: (err) => {
				toast.error("Failed to add passenger to flight");
				console.error("Failed to add passenger to flight", err);
			},
		},
		client,
	);

	const addEmployeeMutation = useMutation(
		{
			mutationFn: (employeeId: number) =>
				actions.flight.addEmployee({ flight_id: id, employee_id: employeeId }),
			onSuccess: () => {
				toast.success("Successfully added employee to flight");
				client.invalidateQueries({
					queryKey: ["flights"],
				});
			},
			onError: (err) => {
				toast.error("Failed to add employee to flight");
				console.error("Failed to add employee to flight", err);
			},
		},
		client,
	);

	const addStopMutation = useMutation(
		{
			mutationFn: (airportId: number) =>
				actions.flight.addStop({ flight_id: id, airport_id: airportId }),
			onSuccess: () => {
				toast.success("Successfully added stop to flight");
				client.invalidateQueries({
					queryKey: ["flights"],
				});
			},
			onError: (err) => {
				toast.error("Failed to add stop to flight");
				console.error("Failed to add stop to flight", err);
			},
		},
		client,
	);

	const removePassengerMutation = useMutation(
		{
			mutationFn: (passengerId: number) =>
				actions.flight.removePassenger({
					flight_id: id,
					passenger_id: passengerId,
				}),
			onSuccess: () => {
				toast.success("Successfully removed passenger from flight");
				client.invalidateQueries({
					queryKey: ["flights"],
				});
			},
			onError: (err) => {
				toast.error("Failed to remove passenger from flight");
				console.error("Failed to remove passenger from flight", err);
			},
		},
		client,
	);

	const removeEmployeeMutation = useMutation(
		{
			mutationFn: (employeeId: number) =>
				actions.flight.removeEmployee({
					flight_id: id,
					employee_id: employeeId,
				}),
			onSuccess: () => {
				toast.success("Successfully removed employee from flight");
				client.invalidateQueries({
					queryKey: ["flights"],
				});
			},
			onError: (err) => {
				toast.error("Failed to remove employee from flight");
				console.error("Failed to remove employee from flight", err);
			},
		},
		client,
	);

	const removeStopMutation = useMutation(
		{
			mutationFn: (airportId: number) =>
				actions.flight.removeStop({
					flight_id: id,
					airport_id: airportId,
				}),
			onSuccess: () => {
				toast.success("Successfully removed stop from flight");
				client.invalidateQueries({
					queryKey: ["airports"],
				});
			},
			onError: (err) => {
				toast.error("Failed to remove stop from flight");
				console.error("Failed to remove stop from flight", err);
			},
		},
		client,
	);

	const passengerColumns = useMemo<ColumnDef<Passenger>[]>(
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
				id: "actions",
				cell: ({ row }) => {
					const passenger = row.original;
					return (
						<RemoveAction
							onClick={() => {
								removePassengerMutation.mutate(passenger.passenger_id);
							}}
						/>
					);
				},
			},
		],
		[removePassengerMutation],
	);

	const crewColumns = useMemo<ColumnDef<Employee>[]>(
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
				id: "delete",
				cell: ({ row }) => {
					const employee = row.original;
					return (
						<RemoveAction
							onClick={() => {
								removeEmployeeMutation.mutate(employee.employee_id);
							}}
						/>
					);
				},
			},
		],
		[removeEmployeeMutation],
	);

	const stopColumns = useMemo<ColumnDef<Airport>[]>(
		() => [
			{
				accessorKey: "airport_id",
				header: ({ column }) => <ColumnHeader column={column} title="ID" />,
			},
			{
				accessorKey: "airport_code",
				header: ({ column }) => (
					<ColumnHeader column={column} title="Airport Code" />
				),
			},
			{
				id: "delete",
				cell: ({ row }) => {
					const airport = row.original;
					return (
						<RemoveAction
							onClick={() => {
								removeStopMutation.mutate(airport.airport_id);
							}}
						/>
					);
				},
			},
		],
		[removeStopMutation],
	);

	const passengerTable = useReactTable({
		data: query.data?.passengers ?? [],
		columns: passengerColumns,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		onSortingChange: setPassengerSorting,
		state: {
			sorting: passengerSorting,
		},
	});

	const crewTable = useReactTable({
		data: query.data?.crew ?? [],
		columns: crewColumns,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		onSortingChange: setCrewSorting,
		state: {
			sorting: crewSorting,
		},
	});

	const stopTable = useReactTable({
		data: query.data?.stops ?? [],
		columns: stopColumns,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		onSortingChange: setStopSorting,
		state: {
			sorting: stopSorting,
		},
	});

	return (
		<>
			<AssignDialog
				selectedType={selected?.type}
				open={selected?.action === "add"}
				onOpenChange={() => {
					setSelected(undefined);
				}}
				onSubmit={(inputId) => {
					if (selected?.type === "passenger") {
						addPassengerMutation.mutate(inputId);
					} else if (selected?.type === "employee") {
						addEmployeeMutation.mutate(inputId);
					} else if (selected?.type === "airport") {
						addStopMutation.mutate(inputId);
					}
				}}
			/>

			<Card className="mx-8">
				<CardHeader>
					<CardTitle>Passengers</CardTitle>
				</CardHeader>
				<CardContent>
					<Button
						onClick={() => {
							setSelected({
								type: "passenger",
								action: "add",
							});
						}}
					>
						<Plus className="w-4 h-4" />
						<span className="ml-2">Add Passenger</span>
					</Button>
					<DataTable table={passengerTable} />
				</CardContent>
			</Card>

			<Card className="mx-8">
				<CardHeader>
					<CardTitle>Crew</CardTitle>
				</CardHeader>
				<CardContent>
					<Button
						onClick={() => {
							setSelected({
								type: "employee",
								action: "add",
							});
						}}
					>
						<Plus className="w-4 h-4" />
						<span className="ml-2">Add Employee</span>
					</Button>
					<DataTable table={crewTable} />
				</CardContent>
			</Card>

			<Card className="mx-8">
				<CardHeader>
					<CardTitle>Stops</CardTitle>
				</CardHeader>
				<CardContent>
					<Button
						onClick={() => {
							setSelected({
								type: "airport",
								action: "add",
							});
						}}
					>
						<Plus className="w-4 h-4" />
						<span className="ml-2">Add Stop</span>
					</Button>
					<DataTable table={stopTable} />
				</CardContent>
			</Card>
		</>
	);
}
