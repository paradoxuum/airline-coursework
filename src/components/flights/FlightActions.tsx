import { ActionsDropdown } from "@/components/ActionsDropdown";
import {
	DropdownMenuItem,
	DropdownMenuSeparator,
} from "@/components/ui/DropdownMenu";
import type { FullFlight } from "@/schema";

export function FlightActions({
	data,
	onSelect,
}: { data: FullFlight; onSelect: (action?: string) => void }) {
	return (
		<ActionsDropdown id={data.flight_id.toString()} onSelect={onSelect}>
			<DropdownMenuSeparator />
			<DropdownMenuItem asChild>
				<a href={`/flight/${data.flight_id}`}>View Details</a>
			</DropdownMenuItem>
		</ActionsDropdown>
	);
}
