import { FlightForm } from "@/components/flights/FlightForm";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/Sheet";
import type { Flight } from "@/schema";

export function AddFlight({
	onSubmit,
	open,
	onOpenChange,
}: {
	onSubmit: (data: Omit<Flight, "flight_id">) => void;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent>
				<SheetHeader>
					<SheetTitle>Add Flight</SheetTitle>
					<SheetDescription>
						Enter flight details here. Click save when you're done.
					</SheetDescription>
				</SheetHeader>

				<FlightForm className="mt-4" onSubmit={onSubmit} />
			</SheetContent>
		</Sheet>
	);
}
