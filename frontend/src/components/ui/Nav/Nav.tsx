"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils/utils";

export type NavAction = {
	label: string;
	href?: string;
	onClick?: () => void;
	variant: "filled" | "outlined" | "orange";
};

export type NavProps = {
	/** Optional back link shown on the left (e.g. "← Back") */
	backLink?: { label: string; href: string };
	/** When true, the logo + brand is centered instead of left-aligned */
	centerLogo?: boolean;
	/** Action buttons rendered on the right */
	actions?: NavAction[];
	/** Optional greeting text shown before actions (e.g. "WELCOME, JOHN") */
	greeting?: string;
	/** Dark mode — dark background with light text/logo */
	dark?: boolean;
	className?: string;
};

function LogoBrand({ dark = false }: { dark?: boolean }) {
	return (
		<div className="flex items-center gap-5">
			<Link href="/" aria-label="Home">
				<Image
					src="/vow-logo.svg"
					alt="Vow logo"
					width={72}
					height={30}
					priority
					className={dark ? "invert" : undefined}
				/>
			</Link>
			<div
				className={cn(
					"hidden h-8 w-px md:block",
					dark ? "bg-white/30" : "bg-brand-cream",
				)}
			/>
			<span
				className={cn(
					"hidden text-lg font-bold font-display tracking-tight md:inline",
					dark ? "text-white" : "text-brand-brown",
				)}
			>
				My Genius Summary
			</span>
		</div>
	);
}

function HamburgerIcon() {
	return (
		<svg
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2.5"
			strokeLinecap="round"
			aria-hidden="true"
		>
			<line x1="3" y1="6" x2="21" y2="6" />
			<line x1="3" y1="12" x2="21" y2="12" />
			<line x1="3" y1="18" x2="21" y2="18" />
		</svg>
	);
}

function actionClasses(variant: NavAction["variant"], dark: boolean) {
	if (variant === "orange")
		return "bg-brand-orange text-white hover:bg-brand-orange/90";
	if (variant === "filled")
		return "bg-brand-brown text-white hover:bg-brand-brown/90";
	// outlined
	return dark
		? "border border-white text-white hover:bg-white/10"
		: "border border-brand-brown text-brand-brown hover:bg-brand-brown/5";
}

export function Nav({
	backLink,
	centerLogo = false,
	actions = [],
	greeting,
	dark = false,
	className,
}: NavProps) {
	const [mobileOpen, setMobileOpen] = React.useState(false);

	return (
		<header
			className={cn(
				"w-full border-b",
				dark
					? "border-white/10 bg-brand-brown"
					: "border-brand-cream/40 bg-white",
				className,
			)}
		>
			<nav className="relative mx-auto flex max-w-7xl items-center justify-between px-6 py-8 sm:px-10 lg:px-16">
				{/* -------- Left zone -------- */}
				<div className="flex min-w-0 items-center">
					{backLink ? (
						<Link
							href={backLink.href}
							className="flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wider text-brand-orange transition-colors hover:text-brand-orange/80"
						>
							<span aria-hidden="true">&larr;</span>
							{backLink.label}
						</Link>
					) : !centerLogo ? (
						<LogoBrand dark={dark} />
					) : (
						<div className="w-0 md:w-auto" />
					)}
				</div>

				{/* -------- Center zone -------- */}
				{centerLogo && (
					<div className="absolute left-1/2 -translate-x-1/2">
						<LogoBrand dark={dark} />
					</div>
				)}

				{/* -------- Right zone (desktop) -------- */}
				<div className="hidden items-center gap-3 md:flex">
					{greeting && (
						<span className="mr-1 text-sm font-semibold uppercase tracking-wider text-brand-orange">
							{greeting}
						</span>
					)}
					{actions.map((action) =>
						action.href ? (
							<Link
								key={action.label}
								href={action.href}
								className={cn(
									"inline-flex h-11 items-center justify-center rounded-full px-7 text-sm font-semibold uppercase tracking-wider transition-colors",
									actionClasses(action.variant, dark),
								)}
							>
								{action.label}
							</Link>
						) : (
							<button
								key={action.label}
								type="button"
								onClick={action.onClick}
								className={cn(
									"inline-flex h-11 items-center justify-center rounded-full px-7 text-sm font-semibold uppercase tracking-wider transition-colors",
									actionClasses(action.variant, dark),
								)}
							>
								{action.label}
							</button>
						),
					)}
				</div>

				{/* -------- Right zone (mobile hamburger) -------- */}
				<div className="md:hidden">
					<Dialog.Root open={mobileOpen} onOpenChange={setMobileOpen}>
						<Dialog.Trigger asChild>
							<button
								className={cn(
									"inline-flex size-10 items-center justify-center rounded-md transition-colors",
									dark
										? "text-white hover:bg-white/10"
										: "text-brand-brown hover:bg-brand-brown/5",
								)}
								aria-label="Open menu"
							>
								<HamburgerIcon />
							</button>
						</Dialog.Trigger>
						<Dialog.Portal>
							<Dialog.Overlay className="fixed inset-0 z-50 bg-black/30 data-[state=open]:[animation:var(--animate-dialog-fade-in)] data-[state=closed]:[animation:var(--animate-dialog-fade-out)]" />
							<Dialog.Content
								className="fixed inset-y-0 right-0 z-50 w-72 max-w-[85vw] bg-white p-6 shadow-xl outline-none data-[state=open]:[animation:var(--animate-dialog-slide-in)] data-[state=closed]:[animation:var(--animate-dialog-slide-out)]"
								aria-label="Mobile menu"
							>
								<div className="flex items-center justify-between">
									<span className="text-sm font-semibold uppercase tracking-wider text-brand-brown/50">
										Menu
									</span>
									<Dialog.Close asChild>
										<button
											className="inline-flex size-9 items-center justify-center rounded-md text-brand-brown/60 transition-colors hover:bg-brand-brown/5"
											aria-label="Close menu"
										>
											<Cross2Icon width={18} height={18} />
										</button>
									</Dialog.Close>
								</div>

								{greeting && (
									<p className="mt-6 text-sm font-semibold uppercase tracking-wider text-brand-orange">
										{greeting}
									</p>
								)}

								<div className="mt-6 flex flex-col gap-3">
									{actions.map((action) =>
										action.href ? (
											<Link
												key={action.label}
												href={action.href}
												onClick={() => setMobileOpen(false)}
												className={cn(
													"inline-flex h-11 items-center justify-center rounded-full px-7 text-sm font-semibold uppercase tracking-wider transition-colors",
													actionClasses(action.variant, false),
												)}
											>
												{action.label}
											</Link>
										) : (
											<button
												key={action.label}
												type="button"
												onClick={() => {
													setMobileOpen(false);
													action.onClick?.();
												}}
												className={cn(
													"inline-flex h-11 items-center justify-center rounded-full px-7 text-sm font-semibold uppercase tracking-wider transition-colors",
													actionClasses(action.variant, false),
												)}
											>
												{action.label}
											</button>
										),
									)}
								</div>

								{backLink && (
									<Link
										href={backLink.href}
										onClick={() => setMobileOpen(false)}
										className="mt-6 flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wider text-brand-orange transition-colors hover:text-brand-orange/80"
									>
										<span aria-hidden="true">&larr;</span>
										{backLink.label}
									</Link>
								)}
							</Dialog.Content>
						</Dialog.Portal>
					</Dialog.Root>
				</div>
			</nav>
		</header>
	);
}

export default Nav;
