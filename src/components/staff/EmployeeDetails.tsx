import { ColumnHeader } from "@/components/ColumnHeader";
import { DataTable } from "@/components/DataTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
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
import { useMemo, useState } from "react";

export function EmployeeDetails({ id }: { id: number }) {
	const query = useQuery(
		{
			queryKey: ["staff", id],
			queryFn: () => actions.staff.get({ employee_id: id }),
		},
		client,
	);
	const [flightSorting, setFlightSorting] = useState<SortingState>([]);

	const flightColumns = useMemo<ColumnDef<Flight>[]>(
		() => [
			{
				accessorKey: "flight_id",
				header: ({ column }) => <ColumnHeader column={column} title="ID" />,
			},
			{
				accessorKey: "departure_date",
				header: ({ column }) => (
					<ColumnHeader column={column} title="Departure Date" />
				),
			},
			{
				accessorKey: "arrival_date",
				header: ({ column }) => (
					<ColumnHeader column={column} title="Arrival Date" />
				),
			},
			{
				accessorKey: "flight_number",
				header: ({ column }) => (
					<ColumnHeader column={column} title="Flight Number" />
				),
			},
		],
		[],
	);

	const flightTable = useReactTable({
		data: query.data?.flights ?? [],
		columns: flightColumns,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		onSortingChange: setFlightSorting,
		state: {
			sorting: flightSorting,
		},
	});

	return (
		<Card className="mx-8">
			<CardHeader>
				<CardTitle>Flights</CardTitle>
			</CardHeader>
			<CardContent>
				<DataTable table={flightTable} />
			</CardContent>
		</Card>
	);
}
