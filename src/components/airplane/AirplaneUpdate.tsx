import { AirplaneForm } from "@/components/airplane/AirplaneForm";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/Sheet";
import type { Airplane } from "@/schema";

export function AirplaneUpdate({
	airplane,
	onSubmit,
	open,
	onOpenChange,
}: {
	airplane?: Airplane;
	onSubmit?: (data: Omit<Airplane, "airplane_id">) => void;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
}) {
	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent>
				<SheetHeader>
					<SheetTitle>Update Airplane {airplane?.airplane_id}</SheetTitle>
					<SheetDescription>
						Update airplane details here. Click save when you're done.
					</SheetDescription>
				</SheetHeader>

				<AirplaneForm
					defaultValues={airplane}
					className="mt-4"
					onSubmit={(data) => onSubmit?.(data)}
				/>
			</SheetContent>
		</Sheet>
	);
}
