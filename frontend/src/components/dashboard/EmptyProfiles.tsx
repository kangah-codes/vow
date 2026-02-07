import Link from "next/link";

export function EmptyProfiles() {
	return (
		<div className="mt-6 flex flex-col items-center rounded-xl border-2 border-dashed border-stone-200 px-6 py-16 text-center">
			<div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-orange/10">
				<svg
					width="28"
					height="28"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="1.5"
					strokeLinecap="round"
					strokeLinejoin="round"
					className="text-brand-orange"
					aria-hidden="true"
				>
					<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
					<circle cx="9" cy="7" r="4" />
					<line x1="19" y1="8" x2="19" y2="14" />
					<line x1="22" y1="11" x2="16" y2="11" />
				</svg>
			</div>
			<h3 className="mt-4 font-display text-lg font-bold text-brand-brown">
				No profiles yet
			</h3>
			<p className="mt-1.5 max-w-sm text-sm text-brand-brown/50">
				Start a guided conversation to create your first student
				profile, or resume one with an access code.
			</p>
			<Link
				href="/start"
				aria-label="Start new profile"
				className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-brand-brown px-6 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-brand-brown/90"
			>
				Start New Profile
			</Link>
		</div>
	);
}
