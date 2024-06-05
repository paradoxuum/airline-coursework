import { ActionsDropdown } from "@/components/ActionsDropdown";
import {
	DropdownMenuItem,
	DropdownMenuSeparator,
} from "@/components/ui/DropdownMenu";
import type { FullEmployee } from "@/schema";

export function EmployeeActions({
	data,
	onSelect,
}: { data: FullEmployee; onSelect: (action?: string) => void }) {
	return (
		<ActionsDropdown id={data.employee_id.toString()} onSelect={onSelect}>
			<DropdownMenuSeparator />
			<DropdownMenuItem asChild>
				<a href={`/employee/${data.employee_id}`}>View Flights</a>
			</DropdownMenuItem>
		</ActionsDropdown>
	);
}
