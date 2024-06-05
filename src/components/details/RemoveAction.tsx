import { Button } from "@/components/ui/Button";
import { Trash } from "lucide-react";

export function RemoveAction({ onClick }: { onClick: () => void }) {
	return (
		<Button onClick={onClick}>
			<Trash className="w-4 h-4 mr-2" />
			<span>Remove</span>
		</Button>
	);
}
