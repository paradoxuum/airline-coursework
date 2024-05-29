import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/Sheet";
import { capitalize } from "@/lib/utils";
import { useMemo } from "react";

export function FormSheet({
	name,
	update,
	open,
	onOpenChange,
	children,
}: {
	name: string;
	update?: boolean;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	children: React.ReactNode;
}) {
	const capitalizedName = useMemo(() => capitalize(name), [name]);

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent>
				<SheetHeader>
					<SheetTitle>
						{update ? "Update" : "Create"} {capitalizedName}
					</SheetTitle>
					<SheetDescription>
						Enter {name} details here. Click save when you're done.
					</SheetDescription>
				</SheetHeader>

				{children}
			</SheetContent>
		</Sheet>
	);
}
