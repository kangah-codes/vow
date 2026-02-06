import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import type { Profile } from "@/lib/hooks/useProfiles";
import { formatGrade } from "@/lib/utils/formatGrade";
import { timeAgo } from "@/lib/utils/timeAgo";
import Link from "next/link";
import { useState } from "react";
import { ProgressBar } from "./ProgressBar";
import { StatusBadge } from "./StatusBadge";

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
							onClick={() => onDownload(profile.studentName, profile.sections)}
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
							<ConfirmDialog
								open={dialogOpen}
								onOpenChange={setDialogOpen}
								title="Delete Profile?"
								description={
									<>
										Are you sure you want to delete{" "}
										<span className="font-semibold text-brand-brown">
											{profile.studentName}&apos;s
										</span>{" "}
										profile? This will permanently remove the profile and all
										conversation history. This action cannot be undone.
									</>
								}
								confirmLabel="Delete Profile"
								confirmingLabel="Deleting..."
								isConfirming={isDeleting}
								preventClose={isDeleting}
								onConfirm={() => onDelete(profile._id)}
								variant="danger"
								trigger={
									<button
										type="button"
										className="inline-flex h-9 items-center justify-center rounded-full border border-red-300 px-4 text-xs font-bold uppercase tracking-wider text-red-600 transition-colors hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2"
									>
										Delete
									</button>
								}
							/>
						)}
					</>
				)}
			</div>
		</article>
	);
}
