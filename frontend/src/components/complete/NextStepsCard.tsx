import Link from "next/link";

interface NextStepsCardProps {
	primaryLabel?: string;
	primaryHref: string;
	secondaryLabel?: string;
	secondaryHref: string;
}

export function NextStepsCard({
	primaryLabel = "View Full Profile",
	primaryHref,
	secondaryLabel = "Start Another Profile",
	secondaryHref,
}: NextStepsCardProps) {
	return (
		<div className="@container rounded-2xl bg-white p-6">
			<h2 className="font-display text-xl font-bold text-brand-brown">
				Next Steps
			</h2>
			<div className="mt-4 grid grid-cols-1 gap-3 @[320px]:grid-cols-2">
				<Link
					href={primaryHref}
					aria-label={primaryLabel}
					className="inline-flex h-12 items-center justify-center rounded-full bg-brand-orange px-4 text-[clamp(0.6rem,2.5cqw,0.875rem)] font-bold uppercase tracking-wider text-white transition-colors hover:bg-brand-orange/90"
				>
					{primaryLabel}
				</Link>
				<Link
					href={secondaryHref}
					aria-label={secondaryLabel}
					className="inline-flex h-12 items-center justify-center rounded-full border border-brand-brown px-4 text-[clamp(0.6rem,2.5cqw,0.875rem)] font-bold uppercase tracking-wider text-brand-brown transition-colors hover:bg-brand-brown/5"
				>
					{secondaryLabel}
				</Link>
			</div>
		</div>
	);
}
