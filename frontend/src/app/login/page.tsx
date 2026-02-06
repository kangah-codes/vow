"use client";

import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Nav } from "@/components/ui/Nav";
import { useLogin } from "@/lib/hooks/useLogin";
import { setAuthCookies } from "@/lib/utils/cookies";
import { GoogleIcon } from "@/components/icons";

interface LoginFormData {
	email: string;
	password: string;
	remember: boolean;
}

export default function LoginPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const login = useLogin();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginFormData>({
		defaultValues: { remember: false },
	});

	const onSubmit = (data: LoginFormData) => {
		login.mutate(
			{ email: data.email, password: data.password },
			{
				onSuccess: (result) => {
					setAuthCookies(result.data.accessToken, result.data.refreshToken);
					const redirect = searchParams.get("redirect") || "/dashboard";
					router.push(redirect);
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

			{/* Background with decorative swooshes */}
			<main className="relative flex flex-1 items-start justify-center overflow-hidden px-6 py-10 md:items-center md:py-16">
				{/* Decorative orange curves */}
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

				{/* Login card */}
				<div className="relative z-10 w-full max-w-md rounded-2xl bg-white px-8 py-12 md:px-14 md:py-16">
					<h1 className="text-center font-display text-3xl font-bold text-brand-brown md:text-4xl">
						Login
					</h1>

					{login.error && (
						<div
							className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700"
							role="alert"
						>
							{login.error.message}
						</div>
					)}

					<form className="mt-10 space-y-5" onSubmit={handleSubmit(onSubmit)}>
						<div>
							<label htmlFor="login-email" className="sr-only">
								Email
							</label>
							<input
								id="login-email"
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
									errors.email ? "login-email-error" : undefined
								}
							/>
							{errors.email && (
								<p
									id="login-email-error"
									className="mt-1.5 text-sm text-red-600"
									role="alert"
								>
									{errors.email.message}
								</p>
							)}
						</div>
						<div>
							<label htmlFor="login-password" className="sr-only">
								Password
							</label>
							<input
								id="login-password"
								type="password"
								placeholder="Password"
								{...register("password", {
									required: "Password is required",
								})}
								className={errors.password ? errorInputClass : inputClass}
								aria-invalid={!!errors.password}
								aria-describedby={
									errors.password ? "login-password-error" : undefined
								}
							/>
							{errors.password && (
								<p
									id="login-password-error"
									className="mt-1.5 text-sm text-red-600"
									role="alert"
								>
									{errors.password.message}
								</p>
							)}
						</div>

						<label className="flex items-center gap-2.5 text-sm text-brand-brown">
							<input
								type="checkbox"
								{...register("remember")}
								className="size-5 rounded border-brand-cream accent-brand-brown"
							/>
							Remember Me
						</label>

						<button
							type="submit"
							disabled={login.isPending}
							className="flex h-13 w-full items-center justify-center rounded-full bg-brand-brown text-base font-bold uppercase tracking-wider text-white transition-colors hover:bg-brand-brown/90 disabled:opacity-60"
						>
							{login.isPending ? "Logging in..." : "Login"}
						</button>
					</form>

					<div className="mt-4 flex items-center justify-center gap-3 text-sm text-brand-brown/50">
						<span>OR</span>
					</div>

					<button
						type="button"
						className="mt-4 flex h-13 w-full items-center justify-center gap-3 rounded-full border border-brand-cream text-sm font-bold uppercase tracking-wider text-brand-brown transition-colors hover:bg-brand-brown/5"
					>
						<GoogleIcon />
						Sign in with Google
					</button>

					<div className="mt-8 space-y-2 text-center text-sm text-brand-brown">
						<p>
							<Link
								href="/forgot-password"
								className="underline underline-offset-2 hover:text-brand-brown/70"
							>
								Forgot password?
							</Link>
						</p>
						<p>
							Don&apos;t have an account?{" "}
							<Link
								href="/signup"
								className="underline underline-offset-2 hover:text-brand-brown/70"
							>
								Sign up
							</Link>
						</p>
					</div>
				</div>
			</main>
		</div>
	);
}
