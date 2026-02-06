"use client";

import { useState } from "react";
import Link from "next/link";
import { Nav } from "@/components/ui/Nav";
import { useRouter } from "next/navigation";

export default function SessionExpiredPage() {
	const [accessCode, setAccessCode] = useState("");
	const router = useRouter();

	return (
		<div className="flex min-h-screen flex-col bg-white">
			<Nav actions={[{ label: "Help", href: "/help", variant: "outlined" }]} />

			<div className="flex flex-1 flex-col items-center px-4 pt-10 pb-16 md:pt-16">
				<span className="text-6xl md:text-7xl" aria-hidden="true">
					⏱️
				</span>

				<h1 className="mt-4 font-display text-4xl font-bold text-brand-brown md:text-5xl">
					Session Expired
				</h1>
				<p className="mt-3 max-w-md text-center text-base text-brand-brown/60">
					Your session has timed out due to inactivity. Please log in again to
					continue.
				</p>

				<div className="mt-8 flex w-full max-w-md flex-col gap-3 sm:flex-row sm:justify-center">
					<Link
						href="/login"
						className="inline-flex h-12 items-center justify-center rounded-full bg-brand-brown px-8 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-brand-brown/90"
					>
						Log In
					</Link>
					<Link
						href="/"
						className="inline-flex h-12 items-center justify-center rounded-full border-2 border-brand-brown px-8 text-sm font-bold uppercase tracking-wider text-brand-brown transition-colors hover:bg-brand-brown/5"
					>
						Go to Home
					</Link>
				</div>

				<div className="mt-10 w-full max-w-md rounded-lg border-l-4 border-brand-blue bg-amber-50 p-5">
					<h3 className="font-bold text-brand-brown">📌 Your work is safe</h3>
					<p className="mt-2 text-sm leading-relaxed text-brand-brown/80">
						All your conversations and profiles have been saved. After logging
						in, you&apos;ll be able to access everything right where you left
						off.
					</p>
				</div>

				<div className="mt-10 w-full max-w-md">
					<h3 className="text-center text-sm font-bold text-brand-brown">
						Or Resume with Access Code
					</h3>
					<label htmlFor="session-expired-access-code" className="sr-only">
						Access code
					</label>
					<input
						id="session-expired-access-code"
						type="text"
						placeholder="XXXX - XXXX"
						aria-label="Access code"
						value={accessCode}
						onChange={(e) => setAccessCode(e.target.value)}
						className="mt-3 h-14 w-full rounded-lg border border-brand-cream bg-white px-4 text-center text-lg tracking-widest text-brand-brown outline-none transition placeholder:text-brand-brown/30 focus:border-brand-brown/40"
					/>
					<button
						type="button"
						onClick={() => {
							router.push(`/shared/${accessCode.replace(/\s/g, "")}`);
						}}
						className="mt-4 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-brand-brown text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-brand-brown/90"
					>
						Continue
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
					<p className="mt-3 text-center">
						<Link
							href="/help"
							className="text-sm text-brand-brown/60 underline underline-offset-2 transition-colors hover:text-brand-brown"
						>
							Where do I find my access code?
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}
