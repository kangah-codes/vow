"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Nav } from "@/components/ui/Nav";
import { ProfileProgress } from "@/components/ui/ProfileProgress";
import {
	DecorativeSwooshes,
	DownloadShareCard,
	ShareWithEducatorCard,
	NextStepsCard,
} from "@/components/complete";
import { ProfileSkeleton } from "@/components/profile";
import { useConversation } from "@/lib/hooks/useConversation";
import { downloadProfilePdf } from "@/lib/utils/downloadProfilePdf";

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
		return <ProfileSkeleton />;
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

			<DecorativeSwooshes />

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
					<DownloadShareCard
						onDownload={handleDownloadPdf}
						onPrint={handlePrint}
					/>
					<ShareWithEducatorCard
						teacherEmail={teacherEmail}
						onTeacherEmailChange={setTeacherEmail}
						onSend={() => {
							// TODO: handle send
						}}
						accessCode={profile.accessCode}
					/>
					<NextStepsCard
						primaryLabel="Back to Dashboard"
						primaryHref="/dashboard"
						secondaryHref="/start"
					/>
				</div>
			</div>
		</div>
	);
}
