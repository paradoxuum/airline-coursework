import { Form } from "@/components/ui/Form";
import { cn } from "@/lib/utils";
import type React from "react";
import type { FieldValues, UseFormReturn } from "react-hook-form";

export function DataForm<F extends FieldValues>({
	className,
	form,
	onSubmit,
	children,
}: {
	className?: string;
	form: UseFormReturn<F>;
	onSubmit: (data: F) => void;
	children?: React.ReactNode;
}) {
	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className={cn("space-y-4", className)}
			>
				{children}
			</form>
		</Form>
	);
}
