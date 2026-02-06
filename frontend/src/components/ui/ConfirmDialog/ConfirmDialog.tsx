"use client";

import * as AlertDialog from "@radix-ui/react-alert-dialog";
import type { ReactNode } from "react";

interface ConfirmDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	title: string;
	description: ReactNode;
	confirmLabel?: string;
	confirmingLabel?: string;
	cancelLabel?: string;
	isConfirming?: boolean;
	onConfirm: () => void;
	/** Prevents closing the dialog while an action is in progress */
	preventClose?: boolean;
	trigger?: ReactNode;
	variant?: "danger" | "default";
}

export function ConfirmDialog({
	open,
	onOpenChange,
	title,
	description,
	confirmLabel = "Confirm",
	confirmingLabel = "Confirming...",
	cancelLabel = "Cancel",
	isConfirming = false,
	onConfirm,
	preventClose = false,
	trigger,
	variant = "default",
}: ConfirmDialogProps) {
	const confirmStyles =
		variant === "danger"
			? "bg-red-600 text-white hover:bg-red-700"
			: "bg-brand-brown text-white hover:bg-brand-brown/90";

	return (
		<AlertDialog.Root
			open={open}
			onOpenChange={(value) => {
				if (!preventClose) onOpenChange(value);
			}}
		>
			{trigger && <AlertDialog.Trigger asChild>{trigger}</AlertDialog.Trigger>}
			<AlertDialog.Portal>
				<AlertDialog.Overlay className="fixed inset-0 z-50 bg-black/40 data-[state=open]:animate-dialog-fade-in data-[state=closed]:animate-dialog-fade-out" />
				<AlertDialog.Content
					className="fixed left-1/2 top-1/2 z-50 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-xl data-[state=open]:animate-dialog-content-in data-[state=closed]:animate-dialog-content-out md:p-8"
					onEscapeKeyDown={(e) => {
						if (preventClose) e.preventDefault();
					}}
				>
					<AlertDialog.Title className="font-display text-xl font-bold text-brand-brown">
						{title}
					</AlertDialog.Title>
					<AlertDialog.Description className="mt-3 text-sm leading-relaxed text-brand-brown/70">
						{description}
					</AlertDialog.Description>
					<div className="mt-6 flex justify-end gap-3">
						<AlertDialog.Cancel asChild>
							<button
								type="button"
								disabled={isConfirming}
								className="inline-flex h-10 items-center justify-center rounded-full border border-brand-brown px-5 text-xs font-bold uppercase tracking-wider text-brand-brown transition-colors hover:bg-brand-brown/5 disabled:opacity-40"
							>
								{cancelLabel}
							</button>
						</AlertDialog.Cancel>
						<button
							type="button"
							disabled={isConfirming}
							onClick={onConfirm}
							className={`inline-flex h-10 items-center justify-center gap-2 rounded-full px-5 text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-60 ${confirmStyles}`}
						>
							{isConfirming && (
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
							{isConfirming ? confirmingLabel : confirmLabel}
						</button>
					</div>
				</AlertDialog.Content>
			</AlertDialog.Portal>
		</AlertDialog.Root>
	);
}
