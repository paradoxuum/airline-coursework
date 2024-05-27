import { DataForm } from "@/components/DataForm";
import { Button } from "@/components/ui/Button";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import { airplaneSchema } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";

const formSchema = airplaneSchema.omit({ airplane_id: true });

export function AirplaneForm({
	className,
	defaultValues,
	onSubmit,
}: {
	className?: string;
	defaultValues?: z.infer<typeof formSchema>;
	onSubmit: (data: z.infer<typeof formSchema>) => void;
}) {
	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues,
	});

	return (
		<DataForm className={className} form={form} onSubmit={onSubmit}>
			<div className="flex gap-2">
				<FormField
					control={form.control}
					name="manufacturer"
					render={({ field }) => {
						return (
							<FormItem>
								<FormLabel>Manufacturer</FormLabel>
								<FormControl>
									<Input placeholder="Enter manufacturer" {...field} />
								</FormControl>
							</FormItem>
						);
					}}
				/>

				<FormField
					control={form.control}
					name="model"
					render={({ field }) => {
						return (
							<FormItem>
								<FormLabel>Model</FormLabel>
								<FormControl>
									<Input placeholder="Enter model" {...field} />
								</FormControl>
							</FormItem>
						);
					}}
				/>
			</div>

			<FormField
				control={form.control}
				name="serial_number"
				render={({ field }) => {
					return (
						<FormItem>
							<FormLabel>Serial Number</FormLabel>
							<FormControl>
								<Input placeholder="Enter serial number" {...field} />
							</FormControl>
						</FormItem>
					);
				}}
			/>

			<Button type="submit">
				<span>Save changes</span>
			</Button>
		</DataForm>
	);
}
