"use client";

import { useState } from "react";
import Link from "next/link";
import { Nav } from "@/components/ui/Nav";
import { useValidateAccessCode } from "@/lib/hooks/useValidateAccessCode";

export default function ResumePage() {
	const [code, setCode] = useState("");
	const { validate, isValidating, error } = useValidateAccessCode();

	return (
		<div className="flex min-h-screen flex-col bg-brand-orange">
			<Nav
				backLink={{ label: "Back", href: "/" }}
				centerLogo
				actions={[{ label: "Help", href: "/help", variant: "outlined" }]}
			/>

			<main className="relative flex flex-1 items-start justify-center overflow-hidden px-6 py-10 md:items-center md:py-16">
				{/* Decorative swooshes */}
				<div
					className="pointer-events-none absolute inset-0"
					aria-hidden="true"
				>
					<svg
						className="absolute -bottom-48 -left-64 h-200 w-300"
						viewBox="0 0 1200 800"
						fill="none"
						preserveAspectRatio="none"
					>
						<path
							d="M-100 400C100 200 400 600 700 300C1000 0 1100 400 1300 200"
							stroke="#E8622A"
							strokeWidth="140"
							strokeLinecap="round"
							fill="none"
							opacity="0.6"
						/>
					</svg>
					<svg
						className="absolute -right-48 -top-32 h-175 w-275"
						viewBox="0 0 1100 700"
						fill="none"
						preserveAspectRatio="none"
					>
						<path
							d="M600 100C700 300 900 500 1000 300C1100 100 800 -100 900 200C1000 500 700 600 600 400"
							stroke="#E8622A"
							strokeWidth="100"
							strokeLinecap="round"
							fill="none"
							opacity="0.5"
						/>
					</svg>
				</div>

				{/* Resume card */}
				<div className="relative z-10 w-full max-w-md rounded-2xl bg-white px-8 py-12 text-center md:px-14 md:py-16">
					<h1 className="font-display text-3xl font-bold text-brand-brown md:text-4xl">
						Resume Your Conversation
					</h1>
					<p className="mx-auto mt-4 max-w-xs text-base text-brand-brown/70">
						Enter your 8-character access code to continue where you left off
					</p>

					<form
						className="mt-8"
						onSubmit={(e) => {
							e.preventDefault();
							validate(code);
						}}
					>
						<label
							htmlFor="resume-access-code"
							className="text-sm font-bold text-brand-brown"
						>
							Access Code:
						</label>
						<input
							id="resume-access-code"
							type="text"
							placeholder="XXXX - XXXX"
							aria-label="Access code"
							value={code}
							onChange={(e) => setCode(e.target.value)}
							maxLength={9}
							required
							disabled={isValidating}
							className="mt-2 h-14 w-full rounded-lg border border-brand-cream bg-white text-center text-xl font-semibold tracking-widest text-brand-brown outline-none transition placeholder:text-brand-brown/30 focus:border-brand-brown/40 disabled:opacity-50"
							aria-invalid={!!error}
							aria-describedby={
								error
									? "resume-access-code-error"
									: "resume-access-code-hint"
							}
						/>
						{error ? (
							<p
								id="resume-access-code-error"
								className="mt-2 text-sm font-medium text-red-600"
								role="alert"
							>
								{error}
							</p>
						) : (
							<p
								id="resume-access-code-hint"
								className="mt-2 text-sm text-brand-brown/50"
							>
								Format: XXXX-XXXX (e.g., XK7P-M4N2)
							</p>
						)}

						<button
							type="submit"
							disabled={isValidating}
							className="mt-8 inline-flex h-13 w-full items-center justify-center gap-2 rounded-full bg-brand-brown text-base font-bold uppercase tracking-wider text-white transition-colors hover:bg-brand-brown/90 disabled:opacity-60"
						>
							{isValidating ? (
								<>
									<svg
										className="h-5 w-5 animate-spin"
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
									Checking...
								</>
							) : (
								<>
									Continue Conversation
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
								</>
							)}
						</button>
					</form>

					{/* Help tip */}
					<div className="mt-6 rounded-lg bg-amber-50 px-5 py-4 text-left border-l-4 border-[#EA882A]">
						<p className="text-sm text-center font-bold text-brand-brown">
							<span aria-hidden="true" className="mr-1">
								💡
							</span>
							Can&apos;t find your code?
						</p>
						<p className="mt-1 text-sm text-brand-brown/70">
							Check your email or look for the code displayed when you started
							your conversation. Access codes are valid for 30 days.
						</p>
					</div>

					<Link
						href="/start"
						aria-label="Start a new profile instead"
						className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wider text-brand-orange transition-colors hover:text-brand-orange/80"
					>
						Start a New Profile Instead
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
					</Link>
				</div>
			</main>
		</div>
	);
}
