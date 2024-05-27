import { capitalize } from "@/lib/utils";
import { client } from "@/stores/app";
import { useMutation } from "@tanstack/react-query";
import { useMemo } from "react";
import { toast } from "sonner";

interface MutationProps<T, I> {
	create: (data: I) => Promise<number>;
	update: (data: T) => Promise<void>;
	delete: (id: number) => Promise<void>;
	name: string;
	key: string[];
}

export function useApiMutation<T, I>(props: MutationProps<T, I>) {
	const capitalizedName = useMemo(() => capitalize(props.name), [props.name]);

	const createMutation = useMutation(
		{
			mutationFn: props.create,
			onSuccess: (id) => {
				toast.success(`${capitalizedName} ${id} created`);
				client.invalidateQueries({ queryKey: props.key });
			},
			onError: (err) => {
				toast.error(`Failed to create ${props.name}`);
				console.error(`Failed to create ${props.name}`, err);
			},
		},
		client,
	);

	const updateMutation = useMutation(
		{
			mutationFn: props.update,
			onSuccess: (id) => {
				toast.success(`${capitalizedName} ${id} updated`);
				client.invalidateQueries({ queryKey: props.key });
			},
			onError: (err) => {
				toast.error(`Failed to update ${props.name}`);
				console.error(`Failed to update ${props.name}`, err);
			},
		},
		client,
	);

	const deleteMutation = useMutation(
		{
			mutationFn: props.delete,
			onSuccess: (_, id) => {
				toast.success(`${capitalizedName} ${id} deleted`);
				client.invalidateQueries({ queryKey: props.key });
			},
			onError: (err, id) => {
				toast.error(`Failed to delete ${props.name} ${id}`);
				console.error(`Failed to delete ${props.name}`, err);
			},
		},
		client,
	);

	return useMemo(
		() => ({
			create: createMutation,
			update: updateMutation,
			delete: deleteMutation,
		}),
		[createMutation, updateMutation, deleteMutation],
	);
}
