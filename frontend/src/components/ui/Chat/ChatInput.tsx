"use client";

import { useRef, useEffect } from "react";
import { cn } from "@/lib/utils/utils";

export type ChatInputProps = {
	value: string;
	onChange: (value: string) => void;
	onSend: () => void;
	placeholder?: string;
	className?: string;
	disabled?: boolean;
};

export function ChatInput({
	value,
	onChange,
	onSend,
	placeholder = "Type your message here...",
	className,
	disabled = false,
}: ChatInputProps) {
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (!disabled) {
			inputRef.current?.focus();
		}
	}, [disabled]);

	return (
		<div
			className={cn(
				"flex items-center gap-3 border-t border-brand-cream/60 px-4 py-3 md:px-6 md:py-4",
				className,
			)}
		>
			<div
				className={cn(
					"bg-amber-50 border border-amber-200 w-full flex items-center gap-3 rounded-full px-3 py-2",
					disabled && "opacity-50",
				)}
			>
				<input
					ref={inputRef}
					type="text"
					value={value}
					onChange={(e) => onChange(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === "Enter" && !e.shiftKey && value.trim() && !disabled) {
							e.preventDefault();
							onSend();
						}
					}}
					placeholder={placeholder}
					disabled={disabled}
					className="h-10 flex-1 rounded-lg bg-amber-50/60 px-4 text-sm text-brand-brown outline-none placeholder:text-brand-brown/40 disabled:cursor-not-allowed md:h-12 md:text-base"
				/>
				<button
					type="button"
					disabled={disabled}
					onClick={() => {
						if (value.trim()) onSend();
					}}
					className="inline-flex h-10 items-center gap-1.5 rounded-full bg-brand-brown px-5 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-brand-brown/90 disabled:cursor-not-allowed md:h-12 md:px-6 md:text-sm"
				>
					Send
					<svg
						width="14"
						height="14"
						viewBox="0 0 16 16"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						aria-hidden="true"
					>
						<path d="M3 8h10M9 4l4 4-4 4" />
					</svg>
				</button>
			</div>
		</div>
	);
}

export default ChatInput;
