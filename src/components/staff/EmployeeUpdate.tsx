import { EmployeeForm } from "@/components/staff/EmployeeForm";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/Sheet";
import type { Employee } from "@/schema";

export function EmployeeUpdate({
	employee,
	onSubmit,
	open,
	onOpenChange,
}: {
	employee?: Employee;
	onSubmit?: (data: Omit<Employee, "employee_id">) => void;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
}) {
	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent>
				<SheetHeader>
					<SheetTitle>Update Employee {employee?.employee_id}</SheetTitle>
					<SheetDescription>
						Update employee details here. Click save when you're done.
					</SheetDescription>
				</SheetHeader>

				<EmployeeForm
					defaultValues={employee}
					className="mt-4"
					onSubmit={(data) => onSubmit?.(data)}
				/>
			</SheetContent>
		</Sheet>
	);
}
