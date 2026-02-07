"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Nav } from "@/components/ui/Nav";
import { useSignup } from "@/lib/hooks/useSignup";
import { setAuthCookies } from "@/lib/utils/cookies";

const roles = ["Parent/Caregiver", "Educator", "Student"] as const;
type Role = (typeof roles)[number];

interface SignupFormData {
	role: Role;
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	confirmPassword: string;
	agreedToTerms: boolean;
}

export default function SignupPage() {
	const router = useRouter();
	const signup = useSignup();
	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm<SignupFormData>({
		defaultValues: {
			agreedToTerms: false,
		},
	});

	// eslint-disable-next-line react-hooks/incompatible-library
	const password = watch("password");
	const onSubmit = (data: SignupFormData) => {
		signup.mutate(
			{
				email: data.email,
				password: data.password,
				firstName: data.firstName,
				lastName: data.lastName,
				role: data.role,
				agreedToTerms: data.agreedToTerms,
			},
			{
				onSuccess: (result) => {
					setAuthCookies(result.data.accessToken, result.data.refreshToken);
					router.push("/dashboard");
				},
			},
		);
	};

	const inputClass =
		"h-14 w-full rounded-lg border border-brand-cream bg-white px-4 text-base text-brand-brown outline-none transition placeholder:text-brand-brown/40 focus:border-brand-brown/40";
	const errorInputClass =
		"h-14 w-full rounded-lg border border-red-400 bg-white px-4 text-base text-brand-brown outline-none transition placeholder:text-brand-brown/40 focus:border-red-400";

	return (
		<div className="flex min-h-screen flex-col bg-brand-orange">
			<Nav
				backLink={{ label: "Back", href: "/" }}
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

					{signup.error && (
						<div
							className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700"
							role="alert"
						>
							{signup.error.message}
						</div>
					)}

					<form className="mt-8" onSubmit={handleSubmit(onSubmit)}>
						{/* Role selection */}
						<fieldset
							aria-describedby={
								errors.role ? "signup-role-error" : undefined
							}
						>
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
											value={r}
											{...register("role", {
												required: "Please select a role",
											})}
											className="size-5 border-brand-cream accent-brand-brown"
										/>
										{r}
									</label>
								))}
							</div>
							{errors.role && (
								<p
									id="signup-role-error"
									className="mt-1.5 text-sm text-red-600"
									role="alert"
								>
									{errors.role.message}
								</p>
							)}
						</fieldset>

						{/* Text inputs */}
						<div className="mt-8 space-y-5">
							<div>
								<label htmlFor="signup-first-name" className="sr-only">
									First Name
								</label>
								<input
									id="signup-first-name"
									type="text"
									placeholder="First Name"
									{...register("firstName", {
										required: "First name is required",
									})}
									className={errors.firstName ? errorInputClass : inputClass}
									aria-invalid={!!errors.firstName}
									aria-describedby={
										errors.firstName ? "signup-first-name-error" : undefined
									}
								/>
								{errors.firstName && (
									<p
										id="signup-first-name-error"
										className="mt-1.5 text-sm text-red-600"
										role="alert"
									>
										{errors.firstName.message}
									</p>
								)}
							</div>

							<div>
								<label htmlFor="signup-last-name" className="sr-only">
									Last Name
								</label>
								<input
									id="signup-last-name"
									type="text"
									placeholder="Last Name"
									{...register("lastName", {
										required: "Last name is required",
									})}
									className={errors.lastName ? errorInputClass : inputClass}
									aria-invalid={!!errors.lastName}
									aria-describedby={
										errors.lastName ? "signup-last-name-error" : undefined
									}
								/>
								{errors.lastName && (
									<p
										id="signup-last-name-error"
										className="mt-1.5 text-sm text-red-600"
										role="alert"
									>
										{errors.lastName.message}
									</p>
								)}
							</div>

							<div>
								<label htmlFor="signup-email" className="sr-only">
									Email
								</label>
								<input
									id="signup-email"
									type="email"
									placeholder="Email"
									{...register("email", {
										required: "Email is required",
										pattern: {
											value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
											message: "Please enter a valid email",
										},
									})}
									className={errors.email ? errorInputClass : inputClass}
									aria-invalid={!!errors.email}
									aria-describedby={
										errors.email ? "signup-email-error" : undefined
									}
								/>
								{errors.email && (
									<p
										id="signup-email-error"
										className="mt-1.5 text-sm text-red-600"
										role="alert"
									>
										{errors.email.message}
									</p>
								)}
							</div>

							<div>
								<label htmlFor="signup-password" className="sr-only">
									Password
								</label>
								<input
									id="signup-password"
									type="password"
									placeholder="Password"
									{...register("password", {
										required: "Password is required",
										minLength: {
											value: 8,
											message: "Password must be at least 8 characters",
										},
									})}
									className={errors.password ? errorInputClass : inputClass}
									aria-invalid={!!errors.password}
									aria-describedby={
										errors.password ? "signup-password-error" : undefined
									}
								/>
								<p className="mt-1.5 text-sm text-brand-brown/50">
									Must be 8+ characters
								</p>
								{errors.password && (
									<p
										id="signup-password-error"
										className="mt-0.5 text-sm text-red-600"
										role="alert"
									>
										{errors.password.message}
									</p>
								)}
							</div>

							<div>
								<label htmlFor="signup-confirm-password" className="sr-only">
									Confirm Password
								</label>
								<input
									id="signup-confirm-password"
									type="password"
									placeholder="Confirm Password"
									{...register("confirmPassword", {
										required: "Please confirm your password",
										validate: (value) =>
											value === password || "Passwords do not match",
									})}
									className={
										errors.confirmPassword ? errorInputClass : inputClass
									}
									aria-invalid={!!errors.confirmPassword}
									aria-describedby={
										errors.confirmPassword
											? "signup-confirm-password-error"
											: undefined
									}
								/>
								{errors.confirmPassword && (
									<p
										id="signup-confirm-password-error"
										className="mt-1.5 text-sm text-red-600"
										role="alert"
									>
										{errors.confirmPassword.message}
									</p>
								)}
							</div>
						</div>

						{/* Terms checkbox */}
						<label className="mt-6 flex items-start gap-2.5 text-sm text-brand-brown">
							<input
								type="checkbox"
								{...register("agreedToTerms", {
									required: "You must agree to the terms",
								})}
								className="mt-0.5 size-5 shrink-0 rounded border-brand-cream accent-brand-brown"
								aria-invalid={!!errors.agreedToTerms}
								aria-describedby={
									errors.agreedToTerms ? "signup-terms-error" : undefined
								}
							/>
							<span>
								I agree to the{" "}
								<Link
									href="/terms"
									aria-label="Terms of Service"
									className="underline underline-offset-2 hover:text-brand-brown/70"
								>
									Terms of Service
								</Link>{" "}
								and{" "}
								<Link
									href="/privacy"
									aria-label="Privacy Policy"
									className="underline underline-offset-2 hover:text-brand-brown/70"
								>
									Privacy Policy
								</Link>
							</span>
						</label>
						{errors.agreedToTerms && (
							<p
								id="signup-terms-error"
								className="mt-1.5 text-sm text-red-600"
								role="alert"
							>
								{errors.agreedToTerms.message}
							</p>
						)}

						{/* Submit */}
						<button
							type="submit"
							disabled={signup.isPending}
							className="mt-8 flex h-13 w-full items-center justify-center rounded-full bg-brand-brown text-base font-bold uppercase tracking-wider text-white transition-colors hover:bg-brand-brown/90 disabled:opacity-60"
						>
							{signup.isPending ? "Creating Account..." : "Create Account"}
						</button>
					</form>

					<p className="mt-6 text-center text-sm text-brand-brown">
						Already registered?{" "}
						<Link
							href="/login"
							aria-label="Log in"
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
