import { cn } from "@/lib/utils/utils";

export type ProfileSectionStatus = "complete" | "in-progress" | "not-started";

export type ProfileSectionData = {
	title: string;
	status: ProfileSectionStatus;
	description?: string;
};

export type ProfileProgressProps = {
	studentName: string;
	percentComplete: number;
	sections: ProfileSectionData[];
	/** Hide the heading and progress bar (useful when wrapping with a custom header) */
	hideHeader?: boolean;
	className?: string;
};

function StatusBadge({ status }: { status: ProfileSectionStatus }) {
	if (status === "complete") {
		return (
			<span className="inline-flex items-center gap-1 rounded-full border border-green-600/30 bg-white px-2 py-1 md:px-3 text-xs font-semibold text-green-700">
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
					<path d="M3 8l3 3 7-7" />
				</svg>
				<span className="hidden sm:inline">Complete</span>
			</span>
		);
	}

	if (status === "in-progress") {
		return (
			<span className="inline-flex items-center gap-1 rounded-full border border-brand-orange/30 bg-white px-2 py-1 md:px-3 text-xs font-semibold text-brand-orange">
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
					<path d="M1 8a7 7 0 1 1 14 0A7 7 0 0 1 1 8z" />
					<path d="M8 4v4l2 2" />
				</svg>
				<span className="hidden sm:inline">In Progress</span>
			</span>
		);
	}

	return (
		<span className="inline-flex items-center gap-1 rounded-full border border-brand-brown/10 bg-white px-2 py-1 md:px-3 text-xs font-semibold text-brand-brown/40">
			<svg
				width="14"
				height="14"
				viewBox="0 0 16 16"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				aria-hidden="true"
			>
				<circle cx="8" cy="8" r="6" />
			</svg>
			<span className="hidden sm:inline">Not Started</span>
		</span>
	);
}

function sectionBg(status: ProfileSectionStatus) {
	if (status === "complete") return "bg-green-50 border-green-200/60";
	if (status === "in-progress") return "bg-amber-50 border-amber-200/60";
	return "bg-stone-50 border-stone-200/40";
}

export function ProfileProgress({
	studentName,
	percentComplete,
	sections,
	hideHeader = false,
	className,
}: ProfileProgressProps) {
	return (
		<div className={cn("flex flex-col", className)}>
			{!hideHeader && (
				<>
					<h2 className="font-display text-2xl font-bold text-brand-brown md:text-3xl">
						{studentName}&apos;s Genius Summary
					</h2>

					{/* Progress bar */}
					<div className="mt-4">
						<div className="h-3 w-full overflow-hidden rounded-full bg-stone-200">
							<div
								className="h-full rounded-full bg-brand-orange transition-all duration-500"
								style={{ width: `${percentComplete}%` }}
							/>
						</div>
						<p className="mt-1.5 text-sm text-brand-brown/60">
							{percentComplete}% Complete
						</p>
					</div>
				</>
			)}

			{/* Section cards */}
			<div className="mt-6 space-y-4">
				{sections.map((section) => (
					<div
						key={section.title}
						className={cn("rounded-xl border p-5", sectionBg(section.status))}
					>
						<div className="flex items-start justify-between gap-4">
							<h3
								className={cn(
									"font-display text-lg font-bold md:text-xl",
									section.status === "not-started"
										? "text-brand-brown/40"
										: "text-brand-brown",
								)}
							>
								{section.title}
							</h3>
							<StatusBadge status={section.status} />
						</div>
						{section.description && (
							<p className="mt-2 text-sm leading-relaxed text-brand-brown/70">
								{section.description}
							</p>
						)}
					</div>
				))}
			</div>
		</div>
	);
}

export default ProfileProgress;
