import { Button } from "@/components/ui/Button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { Ellipsis } from "lucide-react";
import { toast } from "sonner";

export type Action = "delete" | "update";

export function ActionsDropdown<T>({
	id,
	children,
	onSelect,
}: {
	id?: string;
	children?: React.ReactNode;
	onSelect: (action?: string) => void;
}) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" className="h-8 w-8 p-0">
					<span className="sr-only">Open menu</span>
					<Ellipsis className="h-4 w-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuLabel>Actions</DropdownMenuLabel>
				<DropdownMenuItem
					onClick={() => {
						if (id === undefined) return;
						navigator.clipboard.writeText(id);
						toast.success("Copied ID to clipboard");
					}}
				>
					Copy ID
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={() => onSelect("update")}>
					Update
				</DropdownMenuItem>
				<DropdownMenuItem
					className="text-red-500"
					onClick={() => onSelect("delete")}
				>
					Delete
				</DropdownMenuItem>

				{children}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
