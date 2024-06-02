import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";

export function AssignDialog({
	selectedType,
	onSubmit,
	open,
	onOpenChange,
}: {
	selectedType?: "passenger" | "employee";
	onSubmit: (id: number) => void;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	const [id, setId] = useState(1);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Assign {selectedType} to flight</DialogTitle>
				</DialogHeader>

				<div className="grid grid-cols-4 items-center gap-4">
					<Label htmlFor="addId" className="text-right">
						{selectedType === "passenger" ? "Passenger" : "Employee"} ID
					</Label>

					<Input
						id="addId"
						type="number"
						value={id}
						onChange={(e) => setId(Number.parseInt(e.target.value))}
						min={1}
						className="col-span-3"
					/>
				</div>

				<DialogFooter>
					<Button
						onClick={() => {
							onSubmit(id);
							onOpenChange(false);
						}}
					>
						Assign
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
