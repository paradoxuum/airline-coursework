import { PassengerForm } from "@/components/passengers/PassengerForm";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/Sheet";
import type { Passenger } from "@/schema";

export function PassengerUpdate({
	passenger,
	onSubmit,
	open,
	onOpenChange,
}: {
	passenger?: Passenger;
	onSubmit?: (data: Omit<Passenger, "passenger_id">) => void;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
}) {
	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent>
				<SheetHeader>
					<SheetTitle>Update Passenger {passenger?.passenger_id}</SheetTitle>
					<SheetDescription>
						Update passenger details here. Click save when you're done.
					</SheetDescription>
				</SheetHeader>

				<PassengerForm
					defaultValues={passenger}
					className="mt-4"
					onSubmit={(data) => onSubmit?.(data)}
				/>
			</SheetContent>
		</Sheet>
	);
}
