"use client";

import Link from "next/link";
import { Nav } from "@/components/ui/Nav";

export default function NotFound() {
	return (
		<div className="flex min-h-screen flex-col bg-white">
			<Nav
				actions={[{ label: "Help", href: "/help", variant: "outlined" }]}
			/>

			<div className="flex flex-1 flex-col items-center px-4 pt-12 pb-16 md:pt-20">
				<h1 className="font-display text-8xl font-bold text-brand-brown md:text-9xl">
					404
				</h1>
				<h2 className="mt-2 font-display text-2xl font-bold text-brand-brown md:text-3xl">
					Page Not Found
				</h2>
				<p className="mt-3 max-w-md text-center text-base text-brand-brown/60">
					Oops! The page you&apos;re looking for doesn&apos;t exist or
					has been moved.
				</p>

				<div className="mt-8 flex w-full max-w-md flex-col gap-3 sm:flex-row sm:justify-center">
					<Link
						href="/"
						className="inline-flex h-12 items-center justify-center rounded-full bg-brand-brown px-8 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-brand-brown/90"
					>
						Go to Home
					</Link>
					<Link
						href="/dashboard"
						className="inline-flex h-12 items-center justify-center rounded-full border-2 border-brand-brown px-8 text-sm font-bold uppercase tracking-wider text-brand-brown transition-colors hover:bg-brand-brown/5"
					>
						View Dashboard
					</Link>
				</div>

				<div className="mt-12 w-full max-w-md rounded-2xl border border-stone-200 p-6">
					<h3 className="font-display text-lg font-bold text-brand-brown">
						Here are some helpful links:
					</h3>
					<ul className="mt-4 space-y-3">
						<li>
							<Link
								href="/start"
								className="text-sm text-brand-orange underline underline-offset-2 transition-colors hover:text-brand-orange/80"
							>
								Start a new profile
							</Link>
						</li>
						<li>
							<Link
								href="/resume"
								className="text-sm text-brand-orange underline underline-offset-2 transition-colors hover:text-brand-orange/80"
							>
								Resume with access code
							</Link>
						</li>
						<li>
							<Link
								href="/help"
								className="text-sm text-brand-orange underline underline-offset-2 transition-colors hover:text-brand-orange/80"
							>
								Visit help center
							</Link>
						</li>
						<li>
							<Link
								href="/contact"
								className="text-sm text-brand-orange underline underline-offset-2 transition-colors hover:text-brand-orange/80"
							>
								Contact support
							</Link>
						</li>
					</ul>
				</div>
			</div>
		</div>
	);
}
