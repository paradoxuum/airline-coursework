import { flightSchema } from "@/api";
import { DatePicker } from "@/components/flights/DatePicker";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";

const formSchema = flightSchema
	.omit({ id: true })
	.refine((data) => data.arrival > data.departure, {
		message: "Arrival date must be after departure date",
		path: ["arrival"],
	});

export function FlightForm({
	className,
	defaultValues,
	onSubmit,
}: {
	className?: string;
	defaultValues?: z.infer<typeof formSchema>;
	onSubmit: (data: z.infer<typeof formSchema>) => void;
}) {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues,
	});

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className={cn("space-y-4", className)}
			>
				<FormField
					control={form.control}
					name="departure"
					render={({ field }) => {
						return (
							<FormItem>
								<FormLabel>Departure Date</FormLabel>
								<FormControl>
									<DatePicker value={field.value} onChange={field.onChange} />
								</FormControl>
							</FormItem>
						);
					}}
				/>

				<FormField
					control={form.control}
					name="arrival"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Arrival Date</FormLabel>
							<FormControl>
								<DatePicker value={field.value} onChange={field.onChange} />
							</FormControl>
						</FormItem>
					)}
				/>

				<Button type="submit">
					<span>Save changes</span>
				</Button>
			</form>
		</Form>
	);
}
