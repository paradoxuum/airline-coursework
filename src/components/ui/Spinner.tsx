import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export function Spinner({ className }: { className?: string }) {
	return <Loader2 className={cn("animate-spin", className)} />;
}
