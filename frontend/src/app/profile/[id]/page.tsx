"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Nav } from "@/components/ui/Nav";
import { ProfileProgress } from "@/components/ui/ProfileProgress";
import { useConversation } from "@/lib/hooks/useConversation";
import { downloadProfilePdf } from "@/lib/downloadProfilePdf";

function DownloadIcon() {
	return (
		<svg
			width="32"
			height="32"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
		>
			<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
			<polyline points="7 10 12 15 17 10" />
			<line x1="12" y1="15" x2="12" y2="3" />
		</svg>
	);
}

function EmailIcon() {
	return (
		<svg
			width="32"
			height="32"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
		>
			<rect x="2" y="4" width="20" height="16" rx="2" />
			<path d="M22 4L12 13 2 4" />
		</svg>
	);
}

function PrintIcon() {
	return (
		<svg
			width="32"
			height="32"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
		>
			<polyline points="6 9 6 2 18 2 18 9" />
			<path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
			<rect x="6" y="14" width="12" height="8" />
		</svg>
	);
}

export default function ProfilePage() {
	const params = useParams();
	const router = useRouter();
	const id = params.id as string;
	const { data, isLoading, error } = useConversation(id);
	const [teacherEmail, setTeacherEmail] = useState("");

	const handleDownloadPdf = useCallback(async () => {
		if (!data) return;
		await downloadProfilePdf(data.profile.studentName, data.profile.sections);
	}, [data]);

	const handlePrint = useCallback(() => {
		window.print();
	}, []);

	useEffect(() => {
		if (data && data.profile.status !== "complete") {
			router.replace(`/conversation/${id}`);
		}
	}, [data, id, router]);

	if (isLoading) {
		return (
			<div className="relative isolate flex min-h-screen flex-col bg-brand-brown">
				<Nav
					className="relative z-20"
					actions={[{ label: "Help", href: "/help", variant: "outlined" }]}
				/>
				<div className="relative z-10 grid flex-1 grid-cols-1 gap-5 p-4 md:grid-cols-[3fr_2fr] md:p-6">
					<div className="rounded-2xl bg-white p-6 md:p-10">
						<div className="flex flex-col items-center gap-4">
							<div className="h-12 w-12 animate-pulse rounded-full bg-gray-200" />
							<div className="h-8 w-64 animate-pulse rounded bg-gray-200" />
							<div className="h-4 w-48 animate-pulse rounded bg-gray-200" />
						</div>
						<div className="mt-8 space-y-3">
							{[1, 2, 3, 4, 5, 6].map((i) => (
								<div
									key={i}
									className="h-16 w-full animate-pulse rounded-lg bg-gray-100"
								/>
							))}
						</div>
					</div>
					<div className="flex flex-col gap-5">
						<div className="rounded-2xl bg-white p-6">
							<div className="h-6 w-40 animate-pulse rounded bg-gray-200" />
							<div className="mt-4 grid grid-cols-3 gap-3">
								{[1, 2, 3].map((i) => (
									<div
										key={i}
										className="h-20 animate-pulse rounded-xl bg-gray-100"
									/>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}

	if (error) {
		throw error;
	}

	if (!data) {
		throw new Error("Conversation not found");
	}

	if (data.profile.status !== "complete") {
		return null;
	}

	const { profile } = data;

	return (
		<div className="relative isolate flex min-h-screen flex-col bg-brand-brown">
			<Nav
				className="relative z-20"
				actions={[
					{
						label: "Profile Complete",
						href: `/profile/${id}`,
						variant: "orange",
					},
					{ label: "Dashboard", href: "/dashboard", variant: "outlined" },
				]}
			/>

			{/* Decorative swooshes */}
			<div
				className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
				aria-hidden="true"
			>
				<svg
					className="absolute -left-32 -top-20 h-200 w-300"
					viewBox="0 0 1200 800"
					fill="none"
					preserveAspectRatio="none"
				>
					<path
						d="M-100 200C100 400 300 0 500 200C700 400 900 100 1100 300"
						stroke="#DB4733"
						strokeWidth="80"
						strokeLinecap="round"
						fill="none"
						opacity="0.5"
					/>
				</svg>
				<svg
					className="absolute -bottom-32 -right-48 h-200 w-300"
					viewBox="0 0 1200 800"
					fill="none"
					preserveAspectRatio="none"
				>
					<path
						d="M400 0C500 200 700 400 800 200C900 0 1100 300 1300 100C1300 100 1200 500 1000 600"
						stroke="#DB4733"
						strokeWidth="80"
						strokeLinecap="round"
						fill="none"
						opacity="0.4"
					/>
				</svg>
			</div>

			{/* Content */}
			<div className="relative z-10 grid flex-1 grid-cols-1 gap-5 p-4 md:grid-cols-[3fr_2fr] md:p-6">
				{/* Left panel: Profile Complete + Sections */}
				<div id="profile-summary" className="rounded-2xl bg-white p-6 md:p-10">
					<div className="text-center">
						<span className="text-5xl" aria-hidden="true">
							🎉
						</span>
						<h1 className="mt-3 font-display text-3xl font-bold text-brand-brown md:text-4xl">
							Profile Complete!
						</h1>
						<p className="mt-2 text-base text-brand-brown/60">
							{profile.studentName}&apos;s Genius Summary is ready to share
						</p>
					</div>

					<div className="mt-8">
						<ProfileProgress
							studentName={profile.studentName}
							percentComplete={profile.percentComplete}
							sections={profile.sections}
							hideHeader
						/>
					</div>
				</div>

				{/* Right panel: Actions */}
				<div className="flex flex-col gap-5">
					{/* Download & Share */}
					<div className="rounded-2xl bg-white p-6">
						<h2 className="font-display text-xl font-bold text-brand-brown">
							Download &amp; Share
						</h2>
						<div className="mt-4 grid grid-cols-3 gap-3">
							<button
								type="button"
								onClick={handleDownloadPdf}
								className="flex flex-col items-center gap-2 rounded-xl border border-brand-cream/60 p-4 text-brand-brown transition-colors hover:bg-stone-50"
							>
								<DownloadIcon />
								<span className="text-xs font-medium">Download PDF</span>
							</button>
							<button
								type="button"
								className="flex flex-col items-center gap-2 rounded-xl border border-brand-cream/60 p-4 text-brand-brown transition-colors hover:bg-stone-50"
							>
								<EmailIcon />
								<span className="text-xs font-medium">Email Profile</span>
							</button>
							<button
								type="button"
								onClick={handlePrint}
								className="flex flex-col items-center gap-2 rounded-xl border border-brand-cream/60 p-4 text-brand-brown transition-colors hover:bg-stone-50"
							>
								<PrintIcon />
								<span className="text-xs font-medium">Print</span>
							</button>
						</div>
					</div>

					{/* Share with Educator */}
					<div className="rounded-2xl bg-white p-6">
						<h2 className="font-display text-xl font-bold text-brand-brown">
							Share with Educator
						</h2>
						<input
							type="email"
							placeholder="Teacher's email address"
							value={teacherEmail}
							onChange={(e) => setTeacherEmail(e.target.value)}
							className="mt-4 h-14 w-full rounded-lg border border-brand-cream bg-white px-4 text-base text-brand-brown outline-none transition placeholder:text-brand-brown/40 focus:border-brand-brown/40"
						/>
						<button
							type="button"
							onClick={() => {
								// TODO: handle send
							}}
							className="mt-4 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-brand-brown text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-brand-brown/90"
						>
							Send
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
								<path d="M3 8h10M9 4l4 4-4 4" />
							</svg>
						</button>
						<p className="mt-3 text-sm text-brand-brown/60">
							You can also share your access code:{" "}
							<span className="font-bold text-brand-brown">
								{profile.accessCode}
							</span>
						</p>
					</div>

					{/* Next Steps */}
					<div className="@container rounded-2xl bg-white p-6">
						<h2 className="font-display text-xl font-bold text-brand-brown">
							Next Steps
						</h2>
						<div className="mt-4 grid grid-cols-1 gap-3 @[320px]:grid-cols-2">
							<Link
								href="/dashboard"
								className="inline-flex h-12 items-center justify-center rounded-full bg-brand-orange px-4 text-[clamp(0.6rem,2.5cqw,0.875rem)] font-bold uppercase tracking-wider text-white transition-colors hover:bg-brand-orange/90"
							>
								Back to Dashboard
							</Link>
							<Link
								href="/start"
								className="inline-flex h-12 items-center justify-center rounded-full border border-brand-brown px-4 text-[clamp(0.6rem,2.5cqw,0.875rem)] font-bold uppercase tracking-wider text-brand-brown transition-colors hover:bg-brand-brown/5"
							>
								Start Another Profile
							</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
