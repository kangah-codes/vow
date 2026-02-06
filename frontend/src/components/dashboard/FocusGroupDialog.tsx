import { useState } from "react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";

interface FocusGroupDialogProps {
	open: boolean;
	isPending: boolean;
	onRespond: (optIn: boolean) => void;
}

export function FocusGroupDialog({
	open,
	isPending,
	onRespond,
}: FocusGroupDialogProps) {
	const [choice, setChoice] = useState<boolean | null>(null);

	return (
		<AlertDialog.Root
			open={open}
			onOpenChange={() => {
				/* prevent dismissal */
			}}
		>
			<AlertDialog.Portal>
				<AlertDialog.Overlay className="fixed inset-0 z-50 bg-black/40 data-[state=open]:animate-in data-[state=open]:fade-in data-[state=closed]:animate-out data-[state=closed]:fade-out" />
				<AlertDialog.Content
					className="fixed left-1/2 top-1/2 z-50 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-xl md:p-8"
					onEscapeKeyDown={(e) => e.preventDefault()}
				>
					<AlertDialog.Title className="font-display text-xl font-bold text-brand-brown">
						Join Our Focus Group?
					</AlertDialog.Title>
					<AlertDialog.Description className="mt-3 text-sm leading-relaxed text-brand-brown/70">
						We&apos;re looking for participants to help shape the future of
						Village of Wisdom. Would you like to opt in to our focus group?
						Your feedback will help us improve the experience for everyone.
					</AlertDialog.Description>
					<div className="mt-6 flex justify-end gap-3">
						<button
							type="button"
							disabled={isPending}
							onClick={() => {
								setChoice(false);
								onRespond(false);
							}}
							className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-brand-brown px-5 text-xs font-bold uppercase tracking-wider text-brand-brown transition-colors hover:bg-brand-brown/5 disabled:opacity-40"
						>
							{isPending && choice === false && (
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
							No Thanks
						</button>
						<button
							type="button"
							disabled={isPending}
							onClick={() => {
								setChoice(true);
								onRespond(true);
							}}
							className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-brand-brown px-5 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-brand-brown/90 disabled:opacity-60"
						>
							{isPending && choice === true && (
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
							Yes, I&apos;m In
						</button>
					</div>
				</AlertDialog.Content>
			</AlertDialog.Portal>
		</AlertDialog.Root>
	);
}
