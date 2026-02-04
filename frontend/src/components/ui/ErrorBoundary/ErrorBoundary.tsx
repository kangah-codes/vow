"use client";

import { Component, type ReactNode } from "react";
import Link from "next/link";
import { Nav } from "@/components/ui/Nav";

export type ErrorBoundaryProps = {
	children: ReactNode;
};

type ErrorBoundaryState = {
	hasError: boolean;
};

export class ErrorBoundary extends Component<
	ErrorBoundaryProps,
	ErrorBoundaryState
> {
	constructor(props: ErrorBoundaryProps) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError(): ErrorBoundaryState {
		return { hasError: true };
	}

	componentDidCatch(error: Error, info: React.ErrorInfo) {
		console.error("ErrorBoundary caught:", error, info.componentStack);
	}

	handleRetry = () => {
		this.setState({ hasError: false });
	};

	render() {
		if (!this.state.hasError) {
			return this.props.children;
		}

		return (
			<div className="fixed inset-0 z-50 flex min-h-screen flex-col bg-white">
				<Nav
					actions={[{ label: "Help", href: "/help", variant: "outlined" }]}
				/>

				<div className="flex flex-1 flex-col items-center overflow-y-auto px-4 pt-10 pb-16 md:pt-16">
					<div className="flex items-center gap-1">
						<span className="text-6xl md:text-7xl">📡</span>
						<svg
							width="48"
							height="48"
							viewBox="0 0 24 24"
							fill="#DB4733"
							aria-hidden="true"
							className="md:h-14 md:w-14"
						>
							<path d="M18.3 5.71a1 1 0 0 0-1.41 0L12 10.59 7.11 5.7A1 1 0 0 0 5.7 7.11L10.59 12 5.7 16.89a1 1 0 1 0 1.41 1.41L12 13.41l4.89 4.89a1 1 0 0 0 1.41-1.41L13.41 12l4.89-4.89a1 1 0 0 0 0-1.4z" />
						</svg>
					</div>

					<h1 className="mt-4 font-display text-4xl font-bold text-brand-brown md:text-5xl">
						Something went wrong
					</h1>
					<p className="mt-3 max-w-md text-center text-base text-brand-brown/60">
						Something went wrong while trying to connect to our servers.
						Don&apos;t worry – your conversation has been saved.
					</p>

					{/* Buttons */}
					<div className="mt-8 flex w-full max-w-md flex-col gap-3 sm:flex-row sm:justify-center">
						<button
							type="button"
							onClick={this.handleRetry}
							className="inline-flex h-12 items-center justify-center rounded-full bg-brand-brown px-8 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-brand-brown/90"
						>
							Try Again
						</button>
						<Link
							href="/dashboard"
							className="inline-flex h-12 items-center justify-center rounded-full border-2 border-brand-brown px-8 text-sm font-bold uppercase tracking-wider text-brand-brown transition-colors hover:bg-brand-brown/5"
						>
							Go to Dashboard
						</Link>
					</div>

					{/* What this means */}
					<div className="mt-10 w-full max-w-md rounded-lg border-l-4 border-[#EA882A] bg-amber-50 p-5">
						<h3 className="font-bold text-brand-brown">What this means:</h3>
						<ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-brand-brown/80">
							<li>Your progress has been automatically saved</li>
							<li>You can return using your access code</li>
							<li>No data has been lost</li>
						</ul>
					</div>

					{/* Troubleshooting Steps */}
					<div className="mt-6 w-full max-w-md rounded-2xl border border-stone-200 p-6">
						<h3 className="font-display text-xl font-bold text-brand-brown">
							Troubleshooting Steps:
						</h3>
						<ol className="mt-4 list-decimal space-y-3 pl-5 text-sm text-brand-brown/80">
							<li>Check your internet connection</li>
							<li>Try refreshing the page (button above)</li>
							<li>Clear your browser cache and cookies</li>
							<li>Try a different browser</li>
							<li>
								If the problem persists,{" "}
								<Link
									href="/contact"
									className="font-medium text-brand-brown underline underline-offset-2"
								>
									contact support
								</Link>
							</li>
						</ol>
					</div>
				</div>
			</div>
		);
	}
}

export default ErrorBoundary;
