import { DataForm } from "@/components/DataForm";
import { Button } from "@/components/ui/Button";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import { airportSchema } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";

const formSchema = airportSchema.omit({ airport_id: true });

export function AirportForm({
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
			<FormField
				control={form.control}
				name="airport_code"
				render={({ field }) => {
					return (
						<FormItem>
							<FormLabel>Airport Code</FormLabel>
							<FormControl>
								<Input placeholder="Enter code" {...field} />
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
