import { DatePicker } from "@/components/flights/DatePicker";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from "@/components/ui/form";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { client } from "@/stores/app";
import { zodResolver } from "@hookform/resolvers/zod";
import { actions } from "astro:actions";
import { Plus } from "lucide-react";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const flightSchema = z
	.object({
		departure: z.date(),
		arrival: z.date(),
	})
	.refine((data) => data.departure < data.arrival, {
		message: "Departure must be before arrival",
		path: ["departure"],
	});

export function AddFlightButton() {
	const form = useForm<z.infer<typeof flightSchema>>({
		resolver: zodResolver(flightSchema),
	});
	const [sheetOpen, setSheetOpen] = useState(false);

	const onSubmit = useCallback((values: z.infer<typeof flightSchema>) => {
		actions
			.createFlight({
				arrivalDate: values.arrival.toDateString(),
				departureDate: values.departure.toDateString(),
			})
			.then(() => {
				client.invalidateQueries({
					queryKey: ["flights"],
				});
				setSheetOpen(false);
			})
			.catch((err) => console.error(err));
	}, []);

	return (
		<Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
			<SheetTrigger asChild>
				<Button variant="outline">
					<Plus size={16} />
					<span>Add Flight</span>
				</Button>
			</SheetTrigger>
			<SheetContent>
				<SheetHeader>
					<SheetTitle>Add Flight</SheetTitle>
					<SheetDescription>
						Enter flight details here. Click save when you're done.
					</SheetDescription>
				</SheetHeader>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
						<FormField
							control={form.control}
							name="departure"
							render={({ field }) => {
								return (
									<FormItem>
										<FormLabel>Departure Date</FormLabel>
										<FormControl>
											<DatePicker
												value={field.value}
												onChange={field.onChange}
											/>
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

						<Button type="submit">Save changes</Button>
					</form>
				</Form>
			</SheetContent>
		</Sheet>
	);
}
