import type { Flight } from "@/api";
import { FlightForm } from "@/components/flights/FlightForm";
import { Button } from "@/components/ui/Button";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/Sheet";
import { Plus } from "lucide-react";
import { useState } from "react";

export function AddFlightButton({
	onSubmit,
}: { onSubmit: (data: Omit<Flight, "id">) => void }) {
	const [sheetOpen, setSheetOpen] = useState(false);

	return (
		<Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
			<SheetTrigger asChild>
				<Button variant="outline">
					<Plus size={16} />
					<span>Add Flight</span>
				</Button>
			</SheetTrigger>
			<SheetContent>
				<SheetHeader>
					<SheetTitle>Add Flight</SheetTitle>
					<SheetDescription>
						Enter flight details here. Click save when you're done.
					</SheetDescription>
				</SheetHeader>

				<FlightForm className="mt-4" onSubmit={(data) => onSubmit(data)} />
			</SheetContent>
		</Sheet>
	);
}
