import { ColumnHeader } from "@/components/ColumnHeader";
import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Ellipsis } from "lucide-react";
import { useMemo, useState } from "react";

interface Flight {
	id: number;
	departureDate: string;
	arrivalDate: string;
}

export function FlightTable() {
	const query = useQuery(
		{
			queryKey: ["flights"],
			queryFn: () => actions.getFlights(),
		},
		client,
	);
	const [sorting, setSorting] = useState<SortingState>([]);

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
			},
			{
				accessorKey: "arrivalDate",
				header: ({ column }) => {
					return <ColumnHeader column={column} title="Arrival Date" />;
				},
			},
			{
				id: "actions",
				cell: ({ row }) => {
					const flight = row.original;

					return (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" className="h-8 w-8 p-0">
									<span className="sr-only">Open menu</span>
									<Ellipsis className="h-4 w-4" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuLabel>Actions</DropdownMenuLabel>
								<DropdownMenuItem
									onClick={() =>
										navigator.clipboard.writeText(flight.id.toString())
									}
								>
									Copy flight ID
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem>Update</DropdownMenuItem>
								<DropdownMenuItem className="text-red-500">
									Delete
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
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

	return <DataTable table={table} />;
}
