import * as Toast from "@radix-ui/react-toast";

interface DashboardToastProps {
	open: boolean;
	type: "share" | "downloading";
	onOpenChange: (open: boolean) => void;
}

export function DashboardToast({
	open,
	type,
	onOpenChange,
}: DashboardToastProps) {
	return (
		<>
			<Toast.Root
				open={open}
				onOpenChange={onOpenChange}
				duration={type === "downloading" ? Infinity : 3000}
				className="rounded-lg border border-stone-200 bg-white px-4 py-3 shadow-lg data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom-full data-[state=open]:fade-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right-full data-[state=closed]:fade-out"
			>
				<Toast.Title className="flex items-center gap-2 text-sm font-semibold text-brand-brown">
					{type === "downloading" && (
						<svg
							className="h-4 w-4 animate-spin"
							viewBox="0 0 24 24"
							fill="none"
							aria-hidden="true"
						>
							<circle
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								strokeWidth="3"
								className="opacity-25"
							/>
							<path
								d="M4 12a8 8 0 018-8"
								stroke="currentColor"
								strokeWidth="3"
								strokeLinecap="round"
								className="opacity-75"
							/>
						</svg>
					)}
					{type === "share"
						? "Link copied to clipboard"
						: "Downloading profile…"}
				</Toast.Title>
			</Toast.Root>
			<Toast.Viewport className="fixed bottom-0 right-0 z-100 m-4 flex max-w-105 flex-col gap-2" />
		</>
	);
}
