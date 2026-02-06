import { useState } from "react";
import Link from "next/link";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import type { Profile } from "@/lib/hooks/useProfiles";

type ProfileStatus = "complete" | "in-progress";

function timeAgo(dateStr: string): string {
	const now = Date.now();
	const diff = now - new Date(dateStr).getTime();
	const minutes = Math.floor(diff / 60000);
	if (minutes < 1) return "just now";
	if (minutes < 60) return `${minutes}m ago`;
	const hours = Math.floor(minutes / 60);
	if (hours < 24) return `${hours}h ago`;
	const days = Math.floor(hours / 24);
	if (days < 7) return `${days}d ago`;
	const weeks = Math.floor(days / 7);
	if (weeks < 5) return `${weeks}w ago`;
	const months = Math.floor(days / 30);
	return `${months}mo ago`;
}

function formatGrade(gradeLevel: string): string {
	if (gradeLevel === "pre-k") return "Pre-K";
	if (gradeLevel === "k") return "Kindergarten";
	return `Grade ${gradeLevel}`;
}

function StatusBadge({ status }: { status: ProfileStatus }) {
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

function ProgressBar({
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

interface ProfileCardProps {
	profile: Profile;
	onDelete: (id: string) => void;
	onShare: (accessCode: string) => void;
	onDownload: (studentName: string, sections: Profile["sections"]) => void;
	isDeleting: boolean;
}

export function ProfileCard({
	profile,
	onDelete,
	onShare,
	onDownload,
	isDeleting,
}: ProfileCardProps) {
	const isComplete = profile.status === "complete";
	const [dialogOpen, setDialogOpen] = useState(false);

	return (
		<article
			className="flex flex-col h-full rounded-xl border border-stone-200 bg-white p-5"
			aria-label={`${profile.studentName}'s profile`}
		>
			<div className="flex items-start justify-between gap-3">
				<h3 className="font-display text-lg font-bold text-brand-brown">
					{profile.studentName}
				</h3>
				<StatusBadge status={profile.status} />
			</div>

			<p className="mt-1.5 text-xs text-brand-brown/50">
				{formatGrade(profile.gradeLevel)} • Last updated{" "}
				{timeAgo(profile.updatedAt)}
			</p>

			<div className="mt-4">
				<ProgressBar
					percent={profile.percentComplete}
					status={profile.status}
				/>
			</div>

			<div className="mt-4 flex flex-wrap gap-2">
				{isComplete ? (
					<>
						<Link
							href={`/profile/${profile.conversationId}`}
							className="inline-flex h-9 items-center justify-center rounded-full bg-brand-brown px-4 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-brand-brown/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"
						>
							View
						</Link>
						<button
							type="button"
							onClick={() =>
								onDownload(profile.studentName, profile.sections)
							}
							className="cursor-pointer inline-flex h-9 items-center justify-center rounded-full border border-brand-brown px-4 text-xs font-bold uppercase tracking-wider text-brand-brown transition-colors hover:bg-brand-brown/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"
						>
							Download
						</button>
						<button
							type="button"
							onClick={() => onShare(profile.accessCode)}
							className="cursor-pointer inline-flex h-9 items-center justify-center rounded-full border border-brand-brown px-4 text-xs font-bold uppercase tracking-wider text-brand-brown transition-colors hover:bg-brand-brown/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"
						>
							Share
						</button>
					</>
				) : (
					<>
						<Link
							href={`/conversation/${profile.conversationId}`}
							className="inline-flex h-9 items-center justify-center rounded-full bg-brand-brown px-4 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-brand-brown/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"
						>
							Continue
						</Link>
						{profile.percentComplete >= 50 ? (
							<button
								type="button"
								className="inline-flex h-9 items-center justify-center rounded-full border border-brand-brown px-4 text-xs font-bold uppercase tracking-wider text-brand-brown transition-colors hover:bg-brand-brown/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"
							>
								Share Code
							</button>
						) : (
							<AlertDialog.Root
								open={dialogOpen}
								onOpenChange={(open) => {
									if (!isDeleting) setDialogOpen(open);
								}}
							>
								<AlertDialog.Trigger asChild>
									<button
										type="button"
										className="inline-flex h-9 items-center justify-center rounded-full border border-red-300 px-4 text-xs font-bold uppercase tracking-wider text-red-600 transition-colors hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2"
									>
										Delete
									</button>
								</AlertDialog.Trigger>
								<AlertDialog.Portal>
									<AlertDialog.Overlay className="fixed inset-0 z-50 bg-black/40 data-[state=open]:animate-in data-[state=open]:fade-in data-[state=closed]:animate-out data-[state=closed]:fade-out" />
									<AlertDialog.Content
										className="fixed left-1/2 top-1/2 z-50 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-xl md:p-8"
										onEscapeKeyDown={(e) => {
											if (isDeleting) e.preventDefault();
										}}
									>
										<AlertDialog.Title className="font-display text-xl font-bold text-brand-brown">
											Delete Profile?
										</AlertDialog.Title>
										<AlertDialog.Description className="mt-3 text-sm leading-relaxed text-brand-brown/70">
											Are you sure you want to delete{" "}
											<span className="font-semibold text-brand-brown">
												{profile.studentName}&apos;s
											</span>{" "}
											profile? This will permanently remove the profile and all
											conversation history. This action cannot be undone.
										</AlertDialog.Description>
										<div className="mt-6 flex justify-end gap-3">
											<AlertDialog.Cancel asChild>
												<button
													type="button"
													disabled={isDeleting}
													className="inline-flex h-10 items-center justify-center rounded-full border border-brand-brown px-5 text-xs font-bold uppercase tracking-wider text-brand-brown transition-colors hover:bg-brand-brown/5 disabled:opacity-40"
												>
													Cancel
												</button>
											</AlertDialog.Cancel>
											<button
												type="button"
												disabled={isDeleting}
												onClick={() => onDelete(profile._id)}
												className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-red-600 px-5 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-red-700 disabled:opacity-60"
											>
												{isDeleting && (
													<svg
														className="h-4 w-4 animate-spin"
														viewBox="0 0 24 24"
														fill="none"
														aria-hidden="true"
													>
														<circle
															cx="12"
															cy="12"
															r="10"
															stroke="currentColor"
															strokeWidth="3"
															className="opacity-25"
														/>
														<path
															d="M4 12a8 8 0 018-8"
															stroke="currentColor"
															strokeWidth="3"
															strokeLinecap="round"
															className="opacity-75"
														/>
													</svg>
												)}
												{isDeleting ? "Deleting..." : "Delete Profile"}
											</button>
										</div>
									</AlertDialog.Content>
								</AlertDialog.Portal>
							</AlertDialog.Root>
						)}
					</>
				)}
			</div>
		</article>
	);
}
