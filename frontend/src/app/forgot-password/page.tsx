"use client";

import { useState } from "react";
import Link from "next/link";
import { Nav } from "@/components/ui/Nav";

const API_BASE_URL = "http://localhost:3001/api";

export default function ForgotPasswordPage() {
	const [email, setEmail] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [error, setError] = useState<string | null>(null);

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

				{/* Reset card */}
				<div className="relative z-10 w-full max-w-md rounded-2xl bg-white px-8 py-12 text-center md:px-14 md:py-16">
					<h1 className="font-display text-3xl font-bold text-brand-brown md:text-4xl">
						Reset Your Password
					</h1>

					{isSubmitted ? (
						<>
							<div className="mt-6 rounded-lg bg-green-50 px-5 py-4 border-l-4 border-green-500">
								<p className="text-sm font-bold text-green-800">
									Check your email
								</p>
								<p className="mt-1 text-sm text-green-700">
									If an account exists for{" "}
									<span className="font-semibold">{email}</span>,
									you&apos;ll receive a password reset link shortly.
									The link expires in 24 hours.
								</p>
							</div>

							<Link
								href="/login"
								className="mt-8 inline-flex h-13 w-full items-center justify-center rounded-full bg-brand-brown text-base font-bold uppercase tracking-wider text-white transition-colors hover:bg-brand-brown/90"
							>
								Back to Login
							</Link>
						</>
					) : (
						<>
							<p className="mx-auto mt-4 max-w-xs text-base text-brand-brown/70">
								Enter your email address and we&apos;ll send you a
								link to reset your password
							</p>

							{error && (
								<div
									className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700"
									role="alert"
								>
									{error}
								</div>
							)}

							<form
								className="mt-8"
								onSubmit={async (e) => {
									e.preventDefault();
									setIsSubmitting(true);
									setError(null);

									try {
										const res = await fetch(
											`${API_BASE_URL}/auth/forgot-password`,
											{
												method: "POST",
												headers: {
													"Content-Type":
														"application/json",
												},
												body: JSON.stringify({ email }),
											},
										);

										const data = await res.json();

										if (!res.ok) {
											setError(
												data.error ||
													"Something went wrong",
											);
											setIsSubmitting(false);
											return;
										}

										setIsSubmitted(true);
									} catch {
										setError(
											"Unable to connect. Please try again.",
										);
										setIsSubmitting(false);
									}
								}}
							>
								<label htmlFor="forgot-password-email" className="sr-only">
									Email
								</label>
								<input
									id="forgot-password-email"
									type="email"
									placeholder="Email"
									aria-label="Email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
									disabled={isSubmitting}
									className="h-14 w-full rounded-lg border border-brand-cream bg-white px-4 text-base text-brand-brown outline-none transition placeholder:text-brand-brown/40 focus:border-brand-brown/40 disabled:opacity-50"
									aria-invalid={!!error}
									aria-describedby={
										error ? "forgot-password-error" : undefined
									}
								/>
								{error && (
									<span id="forgot-password-error" className="sr-only">
										{error}
									</span>
								)}

								<button
									type="submit"
									disabled={isSubmitting}
									className="mt-6 flex h-13 w-full items-center justify-center rounded-full bg-brand-brown text-base font-bold uppercase tracking-wider text-white transition-colors hover:bg-brand-brown/90 disabled:opacity-60"
								>
									{isSubmitting
										? "Sending..."
										: "Send Reset Link"}
								</button>
							</form>

							<Link
								href="/login"
								className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wider text-brand-orange transition-colors hover:text-brand-orange/80"
							>
								<span aria-hidden="true">&larr;</span>
								Back to Login
							</Link>
						</>
					)}
				</div>
			</main>
		</div>
	);
}
