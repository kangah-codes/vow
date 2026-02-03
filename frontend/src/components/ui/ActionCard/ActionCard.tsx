"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export type ActionCardProps = {
	/** Card heading (displayed uppercase, Recoleta Bold) */
	title: string;
	/** Supporting description below the title */
	description: string;
	/** Button label */
	buttonLabel: string;
	/** Button destination */
	buttonHref?: string;
	/** Called when the button is clicked (used instead of href for form submissions) */
	onButtonClick?: () => void;
	/** Optional input field configuration */
	input?: {
		placeholder: string;
		value: string;
		onChange: (value: string) => void;
	};
	className?: string;
};

export function ActionCard({
	title,
	description,
	buttonLabel,
	buttonHref,
	onButtonClick,
	input,
	className,
}: ActionCardProps) {
	return (
		<div
			className={cn(
				"flex flex-col items-center rounded-2xl bg-white px-8 py-12 text-center md:px-12 md:py-16",
				className,
			)}
		>
			<h2 className="font-display text-2xl font-bold uppercase tracking-tight text-brand-brown md:text-4xl">
				{title}
			</h2>
			<p className="mt-3 text-base text-brand-brown/70 md:mt-4 md:text-lg">
				{description}
			</p>

			{input && (
				<input
					type="text"
					placeholder={input.placeholder}
					value={input.value}
					onChange={(e) => input.onChange(e.target.value)}
					className="mt-8 h-14 w-full max-w-md rounded-lg border border-brand-cream bg-white px-4 text-base text-brand-brown outline-none transition placeholder:text-brand-brown/40 focus:border-brand-brown/40 md:mt-10"
				/>
			)}

			{buttonHref ? (
				<Link
					href={buttonHref}
					className="mt-8 inline-flex h-13 items-center gap-2 rounded-full bg-brand-brown px-8 text-base font-bold uppercase tracking-wide text-white transition-colors hover:bg-brand-brown/90 md:mt-10"
				>
					{buttonLabel}
					<ArrowRight />
				</Link>
			) : (
				<button
					type="button"
					onClick={onButtonClick}
					className="mt-8 inline-flex h-13 items-center gap-2 rounded-full bg-brand-brown px-8 text-base font-bold uppercase tracking-wide text-white transition-colors hover:bg-brand-brown/90 md:mt-10"
				>
					{buttonLabel}
					<ArrowRight />
				</button>
			)}
		</div>
	);
}

function ArrowRight() {
	return (
		<svg
			width="16"
			height="16"
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
	);
}

export default ActionCard;
