export type ProfileStatus = "complete" | "in-progress";

export function StatusBadge({ status }: { status: ProfileStatus }) {
	if (status === "complete") {
		return (
			<span className="inline-flex items-center gap-1 rounded-md bg-green-600 px-2.5 py-1 text-xs font-semibold text-white">
				<svg
					width="12"
					height="12"
					viewBox="0 0 16 16"
					fill="none"
					stroke="currentColor"
					strokeWidth="2.5"
					strokeLinecap="round"
					strokeLinejoin="round"
					aria-hidden="true"
				>
					<path d="M3 8l3 3 7-7" />
				</svg>
				Complete
			</span>
		);
	}

	return (
		<span className="inline-flex items-center gap-1 rounded-md bg-brand-orange px-2.5 py-1 text-xs font-semibold text-white">
			<svg
				width="12"
				height="12"
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
			In Progress
		</span>
	);
}
