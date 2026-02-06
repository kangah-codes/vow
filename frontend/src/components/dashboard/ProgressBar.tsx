import { ProfileStatus } from "./StatusBadge";

export function ProgressBar({
	percent,
	status,
}: {
	percent: number;
	status: ProfileStatus;
}) {
	const barColor =
		status === "complete" ? "bg-brand-orange" : "bg-brand-orange";
	const trackColor =
		status === "complete"
			? "bg-green-100"
			: percent < 50
				? "bg-amber-100"
				: "bg-amber-100";

	return (
		<div>
			<div className={`h-2 w-full overflow-hidden rounded-full ${trackColor}`}>
				<div
					className={`h-full rounded-full ${barColor} transition-all duration-500`}
					style={{ width: `${percent}%` }}
				/>
			</div>
			<p className="mt-1.5 text-xs text-brand-brown/60">{percent}% Complete</p>
		</div>
	);
}
