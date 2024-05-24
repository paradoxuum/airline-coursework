import type { Flight } from "@/api";
import { FlightForm } from "@/components/flights/FlightForm";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";

export function FlightUpdate({
	flight,
	onSubmit,
	open,
	onOpenChange,
}: {
	flight?: Flight;
	onSubmit?: (data: { departure: Date; arrival: Date }) => void;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
}) {
	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent>
				<SheetHeader>
					<SheetTitle>Update Flight {flight?.id}</SheetTitle>
					<SheetDescription>
						Update flight details here. Click save when you're done.
					</SheetDescription>
				</SheetHeader>

				<FlightForm
					defaultValues={flight}
					className="mt-4"
					onSubmit={(data) => onSubmit?.(data)}
				/>
			</SheetContent>
		</Sheet>
	);
}
