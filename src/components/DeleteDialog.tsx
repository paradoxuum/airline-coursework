import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/AlertDialog";

export function DeleteDialog({
	onConfirm,
	onCancel,
	open,
	onOpenChange,
	children,
}: {
	loading?: boolean;
	onConfirm?: () => void;
	onCancel?: () => void;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	children?: React.ReactNode;
}) {
	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			{children}
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone.{" "}
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogAction onClick={onConfirm}>
						<span>Confirm</span>
					</AlertDialogAction>
					<AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
