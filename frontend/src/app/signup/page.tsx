"use client";

import { useState } from "react";
import Link from "next/link";
import { Nav } from "@/components/ui/Nav";

const roles = ["Parent/Caregiver", "Educator", "Student"] as const;
type Role = (typeof roles)[number];

export default function SignupPage() {
	const [role, setRole] = useState<Role | "">("");
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [agreedToTerms, setAgreedToTerms] = useState(false);

	return (
		<div className="flex min-h-screen flex-col bg-brand-orange">
			<Nav
				backLink={{ label: "Back to Home", href: "/" }}
				centerLogo
				actions={[{ label: "Help", href: "/help", variant: "outlined" }]}
			/>

			<main className="relative flex flex-1 items-start justify-center overflow-hidden px-6 py-10 md:py-16">
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

				{/* Register card */}
				<div className="relative z-10 w-full max-w-md rounded-2xl bg-white px-8 py-12 md:px-14 md:py-16">
					<h1 className="font-display text-3xl font-bold text-brand-brown md:text-4xl">
						Create Your Account
					</h1>

					<form
						className="mt-8"
						onSubmit={(e) => {
							e.preventDefault();
							// TODO: handle registration
						}}
					>
						{/* Role selection */}
						<fieldset>
							<legend className="text-base font-bold text-brand-brown">
								I am a:
							</legend>
							<div className="mt-3 space-y-3">
								{roles.map((r) => (
									<label
										key={r}
										className="flex items-center gap-3 text-base text-brand-brown"
									>
										<input
											type="radio"
											name="role"
											value={r}
											checked={role === r}
											onChange={() => setRole(r)}
											className="size-5 border-brand-cream accent-brand-brown"
										/>
										{r}
									</label>
								))}
							</div>
						</fieldset>

						{/* Text inputs */}
						<div className="mt-8 space-y-5">
							<input
								type="text"
								placeholder="First Name"
								value={firstName}
								onChange={(e) => setFirstName(e.target.value)}
								required
								className="h-14 w-full rounded-lg border border-brand-cream bg-white px-4 text-base text-brand-brown outline-none transition placeholder:text-brand-brown/40 focus:border-brand-brown/40"
							/>
							<input
								type="text"
								placeholder="Last Name"
								value={lastName}
								onChange={(e) => setLastName(e.target.value)}
								required
								className="h-14 w-full rounded-lg border border-brand-cream bg-white px-4 text-base text-brand-brown outline-none transition placeholder:text-brand-brown/40 focus:border-brand-brown/40"
							/>
							<input
								type="email"
								placeholder="Email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
								className="h-14 w-full rounded-lg border border-brand-cream bg-white px-4 text-base text-brand-brown outline-none transition placeholder:text-brand-brown/40 focus:border-brand-brown/40"
							/>
							<div>
								<input
									type="password"
									placeholder="Password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									required
									minLength={8}
									className="h-14 w-full rounded-lg border border-brand-cream bg-white px-4 text-base text-brand-brown outline-none transition placeholder:text-brand-brown/40 focus:border-brand-brown/40"
								/>
								<p className="mt-1.5 text-sm text-brand-brown/50">
									Must be 8+ characters
								</p>
							</div>
							<input
								type="password"
								placeholder="Confirm Password"
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
								required
								className="h-14 w-full rounded-lg border border-brand-cream bg-white px-4 text-base text-brand-brown outline-none transition placeholder:text-brand-brown/40 focus:border-brand-brown/40"
							/>
						</div>

						{/* Terms checkbox */}
						<label className="mt-6 flex items-start gap-2.5 text-sm text-brand-brown">
							<input
								type="checkbox"
								checked={agreedToTerms}
								onChange={(e) => setAgreedToTerms(e.target.checked)}
								required
								className="mt-0.5 size-5 shrink-0 rounded border-brand-cream accent-brand-brown"
							/>
							<span>
								I agree to the{" "}
								<Link
									href="/terms"
									className="underline underline-offset-2 hover:text-brand-brown/70"
								>
									Terms of Service
								</Link>{" "}
								and{" "}
								<Link
									href="/privacy"
									className="underline underline-offset-2 hover:text-brand-brown/70"
								>
									Privacy Policy
								</Link>
							</span>
						</label>

						{/* Submit */}
						<button
							type="submit"
							className="mt-8 flex h-13 w-full items-center justify-center rounded-full bg-brand-brown text-base font-bold uppercase tracking-wider text-white transition-colors hover:bg-brand-brown/90"
						>
							Create Account
						</button>
					</form>

					<p className="mt-6 text-center text-sm text-brand-brown">
						Already registered?{" "}
						<Link
							href="/login"
							className="underline underline-offset-2 hover:text-brand-brown/70"
						>
							Log in
						</Link>
					</p>
				</div>
			</main>
		</div>
	);
}
