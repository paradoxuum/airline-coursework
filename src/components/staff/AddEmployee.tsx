import { EmployeeForm } from "@/components/staff/EmployeeForm";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/Sheet";
import type { Employee } from "@/schema";

export function AddEmployee({
	onSubmit,
	open,
	onOpenChange,
}: {
	onSubmit: (data: Omit<Employee, "employee_id">) => void;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent>
				<SheetHeader>
					<SheetTitle>Add Employee</SheetTitle>
					<SheetDescription>
						Enter employee details here. Click save when you're done.
					</SheetDescription>
				</SheetHeader>

				<EmployeeForm className="mt-4" onSubmit={onSubmit} />
			</SheetContent>
		</Sheet>
	);
}
