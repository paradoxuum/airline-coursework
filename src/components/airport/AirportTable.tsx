import { ActionsDropdown } from "@/components/ActionsDropdown";
import { ColumnHeader } from "@/components/ColumnHeader";
import { DataTable } from "@/components/DataTable";
import { DeleteDialog } from "@/components/DeleteDialog";
import { FormSheet } from "@/components/FormSheet";
import { AirportForm } from "@/components/airport/AirportForm";
import { Button } from "@/components/ui/Button";
import { useApiMutation } from "@/lib/useApiMutation";
import type { Airport } from "@/schema";
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

export function AirportTable() {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [currentAction, setCurrentAction] = useState<
		{ type: "create" | "delete" | "update"; airport?: Airport } | undefined
	>();

	const query = useQuery(
		{
			queryKey: ["airports"],
			queryFn: actions.airport.getAll,
		},
		client,
	);

	const mutations = useApiMutation<Airport, Omit<Airport, "airport_id">>({
		create: actions.airport.create,
		update: actions.airport.update,
		delete: (id) => actions.airport.delete({ airport_id: id }),
		getId: (data) => {
			console.log(data);
			return data.airport_id;
		},
		name: "airport",
		key: ["airports"],
	});

	const columns = useMemo<ColumnDef<Airport>[]>(
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
				id: "actions",
				cell: ({ row }) => {
					const airport = row.original;
					return (
						<ActionsDropdown
							id={airport.airport_id.toString()}
							onSelect={(action) => {
								if (action !== "update" && action !== "delete") {
									setCurrentAction(undefined);
									return;
								}

								setCurrentAction({
									type: action,
									airport,
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
				name="airplane"
				open={currentAction?.type === "create"}
				onOpenChange={(open) => {
					if (open) return;
					setCurrentAction(undefined);
				}}
			>
				<AirportForm
					onSubmit={(data) => {
						if (mutations.create.isPending) return;
						mutations.create.mutate(data);
						setCurrentAction(undefined);
					}}
				/>
			</FormSheet>

			<FormSheet
				update
				name="airport"
				open={currentAction?.type === "update"}
				onOpenChange={(open) => {
					if (open) return;
					setCurrentAction(undefined);
				}}
			>
				<AirportForm
					defaultValues={currentAction?.airport}
					onSubmit={(data) => {
						const id = currentAction?.airport?.airport_id;
						if (mutations.update.isPending || id === undefined) return;
						mutations.update.mutate({
							...data,
							airport_id: id,
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
					const id = currentAction?.airport?.airport_id;
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
				<span>Add Airplane</span>
			</Button>

			<DataTable table={table} />
		</>
	);
}
