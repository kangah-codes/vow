import Link from "next/link";
import { Nav } from "@/components/ui/Nav";

interface SharedErrorProps {
	status: number;
}

export function SharedError({ status }: SharedErrorProps) {
	const message =
		status === 410
			? "This access code has expired. Access codes are valid for 30 days."
			: status === 404
				? "Invalid access code. Please check and try again."
				: "Something went wrong while loading the conversation.";

	return (
		<div className="flex min-h-screen flex-col bg-brand-brown">
			<Nav
				actions={[{ label: "Help", href: "/help", variant: "outlined" }]}
			/>
			<div className="flex flex-1 items-center justify-center px-4">
				<div className="w-full max-w-md rounded-2xl bg-white p-8 text-center">
					<span className="text-5xl" aria-hidden="true">
						{status === 410 ? "⏱️" : "🔍"}
					</span>
					<h1 className="mt-4 font-display text-2xl font-bold text-brand-brown">
						{status === 410 ? "Code Expired" : "Conversation Not Found"}
					</h1>
					<p className="mt-3 text-sm text-brand-brown/60">{message}</p>
					<div className="mt-6 flex flex-col gap-3">
						<Link
							href="/resume"
							aria-label="Try another access code"
							className="inline-flex h-12 items-center justify-center rounded-full bg-brand-brown px-8 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-brand-brown/90"
						>
							Try Another Code
						</Link>
						<Link
							href="/"
							aria-label="Go home"
							className="inline-flex h-12 items-center justify-center rounded-full border-2 border-brand-brown px-8 text-sm font-bold uppercase tracking-wider text-brand-brown transition-colors hover:bg-brand-brown/5"
						>
							Go Home
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
