import * as Dialog from "@radix-ui/react-dialog";

interface ProfileCompleteModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	studentName: string;
	onViewProfile: () => void;
}

export function ProfileCompleteModal({
	open,
	onOpenChange,
	studentName,
	onViewProfile,
}: ProfileCompleteModalProps) {
	return (
		<Dialog.Root open={open} onOpenChange={onOpenChange}>
			<Dialog.Portal>
				<Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-[dialog-fade-in_200ms_ease-out]" />
				<Dialog.Content
					className="fixed left-1/2 top-1/2 z-50 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-8 shadow-xl text-center data-[state=open]:animate-[dialog-fade-in_200ms_ease-out]"
					onEscapeKeyDown={(e) => e.preventDefault()}
					onPointerDownOutside={(e) => e.preventDefault()}
				>
					<Dialog.Title className="text-2xl font-display font-bold text-brand-brown">
						Profile Complete!
					</Dialog.Title>
					<Dialog.Description className="mt-3 text-sm leading-relaxed text-brand-brown/70">
						{studentName}&apos;s Genius Profile has been generated and is
						ready to view.
					</Dialog.Description>
					<Dialog.Close asChild>
						<button
							className="mt-6 cursor-pointer w-full rounded-full bg-green-600 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-green-700"
							onClick={onViewProfile}
						>
							View Genius Profile
						</button>
					</Dialog.Close>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
}
