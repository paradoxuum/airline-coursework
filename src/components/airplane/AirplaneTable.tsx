import { ColumnHeader } from "@/components/ColumnHeader";
import { DataTable } from "@/components/DataTable";
import { DeleteDialog } from "@/components/DeleteDialog";
import { AddAirplane } from "@/components/airplane/AddAirplane";
import { AirplaneActions } from "@/components/airplane/AirplaneActions";
import { AirplaneUpdate } from "@/components/airplane/AirplaneUpdate";
import { Button } from "@/components/ui/Button";
import { useApiMutation } from "@/lib/useApiMutation";
import type { Airplane } from "@/schema";
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

export function AirplaneTable() {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [openDialog, setOpenDialog] = useState<
		{ type: "create" | "delete" | "update"; airplane?: Airplane } | undefined
	>();

	const query = useQuery(
		{
			queryKey: ["airplanes"],
			queryFn: actions.airplane.getAll,
		},
		client,
	);

	const mutations = useApiMutation<Airplane, Omit<Airplane, "airplane_id">>({
		create: actions.airplane.create,
		update: actions.airplane.update,
		delete: (id) => actions.airplane.delete({ airplane_id: id }),
		name: "airplane",
		key: ["airplanes"],
	});

	const columns = useMemo<ColumnDef<Airplane>[]>(
		() => [
			{
				accessorKey: "airplane_id",
				header: ({ column }) => <ColumnHeader column={column} title="ID" />,
			},
			{
				accessorKey: "manufacturer",
				header: ({ column }) => (
					<ColumnHeader column={column} title="Manufacturer" />
				),
			},
			{
				accessorKey: "model",
				header: ({ column }) => <ColumnHeader column={column} title="Model" />,
			},
			{
				accessorKey: "serial_number",
				header: ({ column }) => (
					<ColumnHeader column={column} title="Serial Number" />
				),
			},
			{
				id: "actions",
				cell: ({ row }) => {
					const airplane = row.original;
					return (
						<AirplaneActions
							airplane={airplane}
							onDialogChange={(dialog) => {
								if (dialog !== undefined) {
									setOpenDialog({ type: dialog, airplane });
								} else {
									setOpenDialog(undefined);
								}
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
			<AddAirplane
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

			<AirplaneUpdate
				open={openDialog?.type === "update"}
				onOpenChange={(open) => {
					if (!open) setOpenDialog(undefined);
				}}
				onSubmit={(data) => {
					const id = openDialog?.airplane?.airplane_id;
					if (mutations.update.isPending || id === undefined) return;
					mutations.update.mutate({
						...data,
						airplane_id: id,
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
					const id = openDialog?.airplane?.airplane_id;
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
				<span>Add Airplane</span>
			</Button>
			<DataTable table={table} />
		</>
	);
}
