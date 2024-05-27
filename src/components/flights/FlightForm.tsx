import { DataForm } from "@/components/DataForm";
import { Button } from "@/components/ui/Button";
import { DatePicker } from "@/components/ui/DatePicker";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import { flightSchema } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";

const formSchema = flightSchema
	.omit({ flight_id: true })
	.refine((data) => data.arrival_date > data.departure_date, {
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
		<DataForm className={className} form={form} onSubmit={onSubmit}>
			<FormField
				control={form.control}
				name="flight_number"
				render={({ field }) => {
					return (
						<FormItem>
							<FormLabel>Flight Number</FormLabel>
							<FormControl>
								<Input placeholder="Enter flight number" {...field} />
							</FormControl>
						</FormItem>
					);
				}}
			/>

			<FormField
				control={form.control}
				name="departure_date"
				render={({ field }) => {
					return (
						<FormItem>
							<FormLabel>Departure Date</FormLabel>
							<FormControl>
								<DatePicker
									value={
										field.value !== undefined
											? new Date(field.value)
											: undefined
									}
									onChange={(date) => field.onChange(date?.toISOString())}
								/>
							</FormControl>
						</FormItem>
					);
				}}
			/>

			<FormField
				control={form.control}
				name="arrival_date"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Arrival Date</FormLabel>
						<FormControl>
							<DatePicker
								value={
									field.value !== undefined ? new Date(field.value) : undefined
								}
								onChange={(date) => field.onChange(date?.toISOString())}
							/>
						</FormControl>
					</FormItem>
				)}
			/>

			<FormField
				control={form.control}
				name="airplane_id"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Airplane ID</FormLabel>
						<FormControl>
							<Input
								type="number"
								min={1}
								value={field.value}
								onChange={(e) => {
									field.onChange(Number.parseInt(e.target.value));
								}}
							/>
						</FormControl>
					</FormItem>
				)}
			/>

			<Button type="submit">
				<span>Save changes</span>
			</Button>
		</DataForm>
	);
}
