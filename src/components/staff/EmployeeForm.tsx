import { DataForm } from "@/components/DataForm";
import { Button } from "@/components/ui/Button";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import { staffSchema } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";

const formSchema = staffSchema.omit({ employee_id: true });

export function EmployeeForm({
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
					name="first_name"
					render={({ field }) => {
						return (
							<FormItem>
								<FormLabel>First Name</FormLabel>
								<FormControl>
									<Input placeholder="Enter name" {...field} />
								</FormControl>
							</FormItem>
						);
					}}
				/>

				<FormField
					control={form.control}
					name="last_name"
					render={({ field }) => {
						return (
							<FormItem>
								<FormLabel>Last Name</FormLabel>
								<FormControl>
									<Input placeholder="Enter name" {...field} />
								</FormControl>
							</FormItem>
						);
					}}
				/>
			</div>

			<FormField
				control={form.control}
				name="address"
				render={({ field }) => {
					return (
						<FormItem>
							<FormLabel>Address</FormLabel>
							<FormControl>
								<Input placeholder="Enter address" {...field} />
							</FormControl>
						</FormItem>
					);
				}}
			/>

			<FormField
				control={form.control}
				name="phone"
				render={({ field }) => {
					return (
						<FormItem>
							<FormLabel>Phone Number</FormLabel>
							<FormControl>
								<Input placeholder="Enter phone number" {...field} />
							</FormControl>
						</FormItem>
					);
				}}
			/>

			<FormField
				control={form.control}
				name="phone"
				render={({ field }) => {
					return (
						<FormItem>
							<FormLabel>Salary</FormLabel>
							<FormControl>
								<Input
									placeholder="Enter salary"
									type="number"
									min={0}
									value={field.value}
									onChange={(e) => {
										field.onChange(Number.parseInt(e.target.value));
									}}
								/>
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
