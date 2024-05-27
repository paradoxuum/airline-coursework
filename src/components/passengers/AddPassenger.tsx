import { PassengerForm } from "@/components/passengers/PassengerForm";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/Sheet";
import type { Passenger } from "@/schema";

export function AddPassenger({
	onSubmit,
	open,
	onOpenChange,
}: {
	onSubmit: (data: Omit<Passenger, "passenger_id">) => void;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent>
				<SheetHeader>
					<SheetTitle>Add Passenger</SheetTitle>
					<SheetDescription>
						Enter passenger details here. Click save when you're done.
					</SheetDescription>
				</SheetHeader>

				<PassengerForm className="mt-4" onSubmit={onSubmit} />
			</SheetContent>
		</Sheet>
	);
}
