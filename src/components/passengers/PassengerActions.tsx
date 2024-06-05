import { ActionsDropdown } from "@/components/ActionsDropdown";
import {
	DropdownMenuItem,
	DropdownMenuSeparator,
} from "@/components/ui/DropdownMenu";
import type { FullPassenger } from "@/schema";

export function PassengerActions({
	data,
	onSelect,
}: { data: FullPassenger; onSelect: (action?: string) => void }) {
	return (
		<ActionsDropdown id={data.passenger_id.toString()} onSelect={onSelect}>
			<DropdownMenuSeparator />
			<DropdownMenuItem asChild>
				<a href={`/passenger/${data.passenger_id}`}>View Flights</a>
			</DropdownMenuItem>
		</ActionsDropdown>
	);
}
