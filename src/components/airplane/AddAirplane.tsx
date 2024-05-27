import { AirplaneForm } from "@/components/airplane/AirplaneForm";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/Sheet";
import type { Airplane } from "@/schema";

export function AddAirplane({
	onSubmit,
	open,
	onOpenChange,
}: {
	onSubmit: (data: Omit<Airplane, "airplane_id">) => void;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent>
				<SheetHeader>
					<SheetTitle>Add Airplane</SheetTitle>
					<SheetDescription>
						Enter airplane details here. Click save when you're done.
					</SheetDescription>
				</SheetHeader>

				<AirplaneForm className="mt-4" onSubmit={onSubmit} />
			</SheetContent>
		</Sheet>
	);
}
