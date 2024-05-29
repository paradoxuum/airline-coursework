import { ActionsDropdown } from "@/components/ActionsDropdown";
import { ColumnHeader } from "@/components/ColumnHeader";
import { DataTable } from "@/components/DataTable";
import { DeleteDialog } from "@/components/DeleteDialog";
import { FormSheet } from "@/components/FormSheet";
import { AirplaneForm } from "@/components/airplane/AirplaneForm";
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
	const [currentAction, setCurrentAction] = useState<
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
		getId: (data) => data.airplane_id,
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
						<ActionsDropdown
							id={airplane.airplane_id.toString()}
							onSelect={(action) => {
								if (action !== "update" && action !== "delete") {
									setCurrentAction(undefined);
									return;
								}

								setCurrentAction({
									type: action,
									airplane,
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
				<AirplaneForm
					onSubmit={(data) => {
						if (mutations.create.isPending) return;
						mutations.create.mutate(data);
						setCurrentAction(undefined);
					}}
				/>
			</FormSheet>

			<FormSheet
				update
				name="airplane"
				open={currentAction?.type === "update"}
				onOpenChange={(open) => {
					if (open) return;
					setCurrentAction(undefined);
				}}
			>
				<AirplaneForm
					defaultValues={currentAction?.airplane}
					onSubmit={(data) => {
						const id = currentAction?.airplane?.airplane_id;
						if (mutations.update.isPending || id === undefined) return;
						mutations.update.mutate({
							...data,
							airplane_id: id,
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
					const id = currentAction?.airplane?.airplane_id;
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
