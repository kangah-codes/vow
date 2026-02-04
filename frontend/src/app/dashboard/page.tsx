"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { Nav } from "@/components/ui/Nav";
import { useCurrentUser } from "@/lib/hooks/useCurrentUser";
import { useProfiles, type Profile } from "@/lib/hooks/useProfiles";
import { useLogout } from "@/lib/hooks/useLogout";
import { useDeleteProfile } from "@/lib/hooks/useDeleteProfile";
import { useFocusGroupPrompt } from "@/lib/hooks/useFocusGroupPrompt";

/* ── Types ── */

type ProfileStatus = "complete" | "in-progress";

/* ── Helpers ── */

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

/* ── Status Badge ── */

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

/* ── Progress Bar ── */

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

/* ── Profile Card ── */

function ProfileCardComponent({
	profile,
	onDelete,
	isDeleting,
}: {
	profile: Profile;
	onDelete: (id: string) => void;
	isDeleting: boolean;
}) {
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
							className="inline-flex h-9 items-center justify-center rounded-full border border-brand-brown px-4 text-xs font-bold uppercase tracking-wider text-brand-brown transition-colors hover:bg-brand-brown/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"
						>
							Download
						</button>
						<button
							type="button"
							className="inline-flex h-9 items-center justify-center rounded-full border border-brand-brown px-4 text-xs font-bold uppercase tracking-wider text-brand-brown transition-colors hover:bg-brand-brown/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"
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
											Delete Profile
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

/* ── Profiles Carousel ── */

function ProfilesCarousel({
	profiles,
	onDelete,
	deletingId,
}: {
	profiles: Profile[];
	onDelete: (id: string) => void;
	deletingId: string | null;
}) {
	const scrollContainerRef = useRef<HTMLDivElement>(null);

	return (
		<div className="relative mt-6">
			{/* Scrollable Container */}
			<div
				ref={scrollContainerRef}
				className="flex items-stretch gap-4 overflow-x-scroll snap-x snap-mandatory scroll-smooth pb-4"
			>
				{profiles.map((profile) => (
					<div
						key={profile._id}
						className="flex-none w-full md:w-[calc(33.333%-0.667rem)] snap-start"
					>
						<ProfileCardComponent
							profile={profile}
							onDelete={onDelete}
							isDeleting={deletingId === profile._id}
						/>
					</div>
				))}
			</div>
		</div>
	);
}

function AccountSettings({
	name,
	email,
	role,
}: {
	name: string;
	email: string;
	role: string;
}) {
	return (
		<section
			className="rounded-xl border border-stone-200 bg-white p-5 md:p-8"
			aria-labelledby="account-settings-heading"
		>
			<h2
				id="account-settings-heading"
				className="font-display text-xl font-bold text-brand-brown md:text-2xl"
			>
				Account Settings
			</h2>

			<dl className="mt-6 divide-y divide-stone-100">
				<div className="py-4 first:pt-0">
					<dt className="text-sm font-bold text-brand-brown">Name</dt>
					<dd className="mt-1 text-sm text-brand-brown/70">{name}</dd>
					<dd>
						<button
							type="button"
							className="mt-1 text-sm text-brand-brown underline underline-offset-2 transition-colors hover:text-brand-brown/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"
						>
							Edit
						</button>
					</dd>
				</div>

				<div className="py-4">
					<dt className="text-sm font-bold text-brand-brown">Email</dt>
					<dd className="mt-1 text-sm text-brand-brown/70">{email}</dd>
					<dd>
						<button
							type="button"
							className="mt-1 text-sm text-brand-brown underline underline-offset-2 transition-colors hover:text-brand-brown/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"
						>
							Change email
						</button>
					</dd>
				</div>

				<div className="py-4">
					<dt className="text-sm font-bold text-brand-brown">Password</dt>
					<dd className="mt-1 text-sm text-brand-brown/70">••••••••</dd>
					<dd>
						<button
							type="button"
							className="mt-1 text-sm text-brand-brown underline underline-offset-2 transition-colors hover:text-brand-brown/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"
						>
							Change password
						</button>
					</dd>
				</div>

				<div className="py-4">
					<dt className="text-sm font-bold text-brand-brown">Account Type</dt>
					<dd className="mt-1 text-sm text-brand-brown/70">{role}</dd>
				</div>
			</dl>
		</section>
	);
}

/* ── Page ── */

export default function DashboardPage() {
	const { data: user, isLoading: userLoading } = useCurrentUser();
	const { data: profiles, isLoading: profilesLoading } = useProfiles();
	const { mutate: logout } = useLogout();
	const deleteProfile = useDeleteProfile();
	const focusGroupPrompt = useFocusGroupPrompt();
	const [deletingId, setDeletingId] = useState<string | null>(null);
	const [focusGroupChoice, setFocusGroupChoice] = useState<boolean | null>(
		null,
	);

	const showFocusGroupDialog =
		!userLoading && user && user.focusGroupPrompted === false;

	const handleDelete = (profileId: string) => {
		setDeletingId(profileId);
		deleteProfile.mutate(profileId, {
			onSettled: () => setDeletingId(null),
		});
	};

	const isLoading = userLoading || profilesLoading;

	return (
		<div className="flex min-h-screen flex-col bg-white">
			<Nav
				greeting={user ? `Welcome, ${user.firstName}` : undefined}
				actions={[
					{ label: "Help", href: "/help", variant: "filled" },
					{ label: "Logout", onClick: () => logout(), variant: "outlined" },
				]}
			/>

			<main className="mx-auto w-full max-w-6xl flex-1 px-4 pt-8 pb-16 md:px-6 md:pt-12">
				{/* Header */}
				<h1 className="font-display text-4xl font-bold text-brand-brown md:text-5xl">
					My Dashboard
				</h1>
				<p className="mt-2 text-sm text-brand-brown/60">
					Manage your student profiles and account settings
				</p>

				{/* Action buttons */}
				<div className="mt-6 flex flex-col gap-3 sm:flex-row">
					<Link
						href="/start"
						className="inline-flex h-12 items-center justify-center rounded-full bg-brand-brown px-6 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-brand-brown/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"
					>
						Start New Profile
					</Link>
					<Link
						href="/resume"
						className="inline-flex h-12 items-center justify-center rounded-full border-2 border-brand-brown px-6 text-sm font-bold uppercase tracking-wider text-brand-brown transition-colors hover:bg-brand-brown/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"
					>
						Resume with Code
					</Link>
				</div>

				{/* Your Profiles */}
				<section className="mt-12" aria-labelledby="profiles-heading">
					<h2
						id="profiles-heading"
						className="font-display text-2xl font-bold text-brand-brown md:text-3xl"
					>
						Your Profiles
					</h2>

					{isLoading ? (
						<div className="mt-6 flex items-stretch gap-4 overflow-hidden pb-4">
							{[1, 2, 3].map((i) => (
								<div
									key={i}
									className="flex-none w-full md:w-[calc(33.333%-0.667rem)] rounded-xl border border-stone-200 bg-white p-5"
								>
									<div className="flex items-start justify-between gap-3">
										<div className="h-5 w-28 animate-pulse rounded bg-gray-200" />
										<div className="h-6 w-20 animate-pulse rounded-full bg-gray-200" />
									</div>
									<div className="mt-2 h-3 w-40 animate-pulse rounded bg-gray-100" />
									<div className="mt-4">
										<div className="h-2 w-full animate-pulse rounded-full bg-gray-100" />
										<div className="mt-1.5 h-3 w-20 animate-pulse rounded bg-gray-100" />
									</div>
									<div className="mt-4 flex gap-2">
										<div className="h-9 w-20 animate-pulse rounded-full bg-gray-200" />
										<div className="h-9 w-24 animate-pulse rounded-full bg-gray-100" />
									</div>
								</div>
							))}
						</div>
					) : profiles && profiles.length > 0 ? (
						<ProfilesCarousel
							profiles={profiles}
							onDelete={handleDelete}
							deletingId={deletingId}
						/>
					) : (
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
								className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-brand-brown px-6 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-brand-brown/90"
							>
								Start New Profile
							</Link>
						</div>
					)}
				</section>

				{/* Account Settings */}
				<div className="mt-12">
					{isLoading ? (
						<section className="rounded-xl border border-stone-200 bg-white p-5 md:p-8">
							<div className="h-6 w-40 animate-pulse rounded bg-gray-200" />
							<div className="mt-6 divide-y divide-stone-100">
								{[1, 2, 3, 4].map((i) => (
									<div key={i} className="py-4 first:pt-0">
										<div className="h-3 w-16 animate-pulse rounded bg-gray-200" />
										<div className="mt-2 h-3 w-48 animate-pulse rounded bg-gray-100" />
										{i < 4 && (
											<div className="mt-2 h-3 w-20 animate-pulse rounded bg-gray-100" />
										)}
									</div>
								))}
							</div>
						</section>
					) : (
						<AccountSettings
							name={user ? `${user.firstName} ${user.lastName}` : ""}
							email={user ? user.email : ""}
							role={user ? user.role : ""}
						/>
					)}
				</div>
			</main>

			{/* Focus Group Opt-In Dialog — shown once on first login */}
			<AlertDialog.Root
				open={!!showFocusGroupDialog}
				onOpenChange={() => {
					/* prevent dismissal */
				}}
			>
				<AlertDialog.Portal>
					<AlertDialog.Overlay className="fixed inset-0 z-50 bg-black/40 data-[state=open]:animate-in data-[state=open]:fade-in data-[state=closed]:animate-out data-[state=closed]:fade-out" />
					<AlertDialog.Content
						className="fixed left-1/2 top-1/2 z-50 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-xl md:p-8"
						onEscapeKeyDown={(e) => e.preventDefault()}
					>
						<AlertDialog.Title className="font-display text-xl font-bold text-brand-brown">
							Join Our Focus Group?
						</AlertDialog.Title>
						<AlertDialog.Description className="mt-3 text-sm leading-relaxed text-brand-brown/70">
							We&apos;re looking for participants to help shape the future of
							Village of Wisdom. Would you like to opt in to our focus group?
							Your feedback will help us improve the experience for everyone.
						</AlertDialog.Description>
						<div className="mt-6 flex justify-end gap-3">
							<button
								type="button"
								disabled={focusGroupPrompt.isPending}
								onClick={() => {
									setFocusGroupChoice(false);
									focusGroupPrompt.mutate(false);
								}}
								className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-brand-brown px-5 text-xs font-bold uppercase tracking-wider text-brand-brown transition-colors hover:bg-brand-brown/5 disabled:opacity-40"
							>
								{focusGroupPrompt.isPending && focusGroupChoice === false && (
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
								No Thanks
							</button>
							<button
								type="button"
								disabled={focusGroupPrompt.isPending}
								onClick={() => {
									setFocusGroupChoice(true);
									focusGroupPrompt.mutate(true);
								}}
								className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-brand-brown px-5 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-brand-brown/90 disabled:opacity-60"
							>
								{focusGroupPrompt.isPending && focusGroupChoice === true && (
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
								Yes, I&apos;m In
							</button>
						</div>
					</AlertDialog.Content>
				</AlertDialog.Portal>
			</AlertDialog.Root>
		</div>
	);
}
