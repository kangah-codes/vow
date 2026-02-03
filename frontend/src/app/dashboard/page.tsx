"use client";

import Link from "next/link";
import { Nav } from "@/components/ui/Nav";

/* ── Types ── */

type ProfileStatus = "complete" | "in-progress";

type ProfileCard = {
	id: string;
	studentName: string;
	grade: string;
	lastUpdated: string;
	percentComplete: number;
	status: ProfileStatus;
};

/* ── Mock Data ── */

const MOCK_PROFILES: ProfileCard[] = [
	{
		id: "1",
		studentName: "Sarah Johnson",
		grade: "Grade 5",
		lastUpdated: "2 days ago",
		percentComplete: 100,
		status: "complete",
	},
	{
		id: "2",
		studentName: "Michael Chen",
		grade: "Grade 8",
		lastUpdated: "5 hours ago",
		percentComplete: 65,
		status: "in-progress",
	},
	{
		id: "3",
		studentName: "Emma Rodriguez",
		grade: "Grade 3",
		lastUpdated: "1 week ago",
		percentComplete: 25,
		status: "in-progress",
	},
];

/* ── Status Badge ── */

function StatusBadge({ status }: { status: ProfileStatus }) {
	if (status === "complete") {
		return (
			<span className="inline-flex items-center gap-1 rounded-full bg-green-600 px-2.5 py-1 text-xs font-semibold text-white">
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
		<span className="inline-flex items-center gap-1 rounded-full bg-brand-orange px-2.5 py-1 text-xs font-semibold text-white">
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

function ProfileCardComponent({ profile }: { profile: ProfileCard }) {
	const isComplete = profile.status === "complete";

	return (
		<article
			className="flex flex-col rounded-xl border border-stone-200 bg-white p-5"
			aria-label={`${profile.studentName}'s profile`}
		>
			<div className="flex items-start justify-between gap-3">
				<h3 className="font-display text-lg font-bold text-brand-brown">
					{profile.studentName}
				</h3>
				<StatusBadge status={profile.status} />
			</div>

			<p className="mt-1.5 text-xs text-brand-brown/50">
				{profile.grade} • Last updated {profile.lastUpdated}
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
							href={`/profile/${profile.id}`}
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
							href={`/conversation/${profile.id}`}
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
							<button
								type="button"
								className="inline-flex h-9 items-center justify-center rounded-full border border-brand-brown px-4 text-xs font-bold uppercase tracking-wider text-brand-brown transition-colors hover:bg-brand-brown/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"
							>
								Delete
							</button>
						)}
					</>
				)}
			</div>
		</article>
	);
}

/* ── Account Settings ── */

function AccountSettings() {
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
					<dd className="mt-1 text-sm text-brand-brown/70">John Smith</dd>
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
					<dd className="mt-1 text-sm text-brand-brown/70">
						john.smith@email.com
					</dd>
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
					<dd className="mt-1 text-sm text-brand-brown/70">Parent/Caregiver</dd>
				</div>
			</dl>
		</section>
	);
}

/* ── Page ── */

export default function DashboardPage() {
	return (
		<div className="flex min-h-screen flex-col bg-white">
			<Nav
				greeting="Welcome, John"
				actions={[
					{ label: "Help", href: "/help", variant: "filled" },
					{ label: "Logout", href: "/login", variant: "filled" },
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

					<div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
						{MOCK_PROFILES.map((profile) => (
							<ProfileCardComponent key={profile.id} profile={profile} />
						))}
					</div>
				</section>

				{/* Account Settings */}
				<div className="mt-12">
					<AccountSettings />
				</div>
			</main>
		</div>
	);
}
