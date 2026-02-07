import Link from "next/link";
import {
	EmailSupportIcon,
	LiveChatIcon,
	DocumentationIcon,
} from "@/components/icons";

export function ContactSection() {
	return (
		<section
			className="mt-14 rounded-2xl bg-stone-50 p-6 md:p-8 border border-stone-300"
			aria-labelledby="still-need-help"
		>
			<div className="text-center">
				<h2
					id="still-need-help"
					className="font-display text-xl font-bold text-brand-brown md:text-2xl"
				>
					Still Need Help?
				</h2>
				<p className="mt-1 text-sm text-brand-brown/60">
					Our support team is here to assist you
				</p>
			</div>

			<div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
				<Link
					href="mailto:support@villageofwisdom.org"
					aria-label="Email support at support@villageofwisdom.org"
					className="flex flex-col items-center gap-3 rounded-xl border border-stone-200 bg-white p-5 text-brand-brown transition-colors hover:border-stone-300 hover:bg-stone-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"
				>
					<EmailSupportIcon />
					<div className="text-center">
						<p className="text-sm font-bold">Email Support</p>
						<p className="mt-0.5 text-xs text-brand-brown/60 underline underline-offset-2">
							support@villageofwisdom.org
						</p>
					</div>
				</Link>

				<button
					type="button"
					className="flex flex-col items-center gap-3 rounded-xl border border-stone-200 bg-white p-5 text-brand-brown transition-colors hover:border-stone-300 hover:bg-stone-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"
				>
					<LiveChatIcon />
					<div className="text-center">
						<p className="text-sm font-bold">Live Chat</p>
						<p className="mt-0.5 text-xs text-brand-brown/60">
							Start a conversation
						</p>
					</div>
				</button>

				<Link
					href="/docs"
					aria-label="View documentation"
					className="flex flex-col items-center gap-3 rounded-xl border border-stone-200 bg-white p-5 text-brand-brown transition-colors hover:border-stone-300 hover:bg-stone-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"
				>
					<DocumentationIcon />
					<div className="text-center">
						<p className="text-sm font-bold">Documentation</p>
						<p className="mt-0.5 text-xs text-brand-brown/60">
							View full guides
						</p>
					</div>
				</Link>
			</div>
		</section>
	);
}
