"use client";

import { useState } from "react";
import { Nav } from "@/components/ui/Nav";
import { ProfileProgress } from "@/components/ui/ProfileProgress";
import type { ProfileSectionData } from "@/components/ui/ProfileProgress";
import {
	DecorativeSwooshes,
	DownloadShareCard,
	NextStepsCard,
	ShareWithEducatorCard,
} from "@/components/complete";

const COMPLETED_SECTIONS: ProfileSectionData[] = [
	{
		title: "Interest Awareness",
		status: "complete",
		description:
			"Strong creative interests, particularly in visual arts with sustained engagement.",
	},
	{
		title: "Racial/Cultural Pride",
		status: "complete",
		description:
			"Demonstrates awareness and pride in cultural heritage through family storytelling.",
	},
	{
		title: "Can-Do Attitude",
		status: "complete",
		description:
			"Shows resilience and persistence when facing creative challenges.",
	},
	{
		title: "Multicultural Navigation",
		status: "complete",
		description:
			"Comfortable in diverse settings and shows cultural flexibility.",
	},
	{
		title: "Selective Trust",
		status: "complete",
		description:
			"Demonstrates appropriate discernment in relationships while remaining open.",
	},
	{
		title: "Social Justice",
		status: "complete",
		description:
			"Emerging awareness of fairness and empathy for others' experiences.",
	},
];

export default function CompletePage() {
	const [teacherEmail, setTeacherEmail] = useState("");

	return (
		<div className="relative isolate flex min-h-screen flex-col bg-brand-brown">
			<Nav
				className="relative z-20"
				actions={[
					{
						label: "Profile Complete",
						href: "/complete",
						variant: "orange",
					},
					{ label: "Help", href: "/help", variant: "outlined" },
				]}
			/>

			<DecorativeSwooshes />

			{/* Content */}
			<div className="relative z-10 grid flex-1 grid-cols-1 gap-5 p-4 md:grid-cols-[3fr_2fr] md:p-6">
				{/* ── Left panel: Profile Complete + Sections ── */}
				<div className="rounded-2xl bg-white p-6 md:p-10">
					<div className="text-center">
						<span className="text-5xl" aria-hidden="true">
							🎉
						</span>
						<h1 className="mt-3 font-display text-3xl font-bold text-brand-brown md:text-4xl">
							Profile Complete!
						</h1>
						<p className="mt-2 text-base text-brand-brown/60">
							Sarah&apos;s Genius Summary is ready to share
						</p>
					</div>

					<div className="mt-8">
						<ProfileProgress
							studentName="Sarah"
							percentComplete={100}
							sections={COMPLETED_SECTIONS}
							hideHeader
						/>
					</div>
				</div>

				{/* ── Right panel: Actions ── */}
				<div className="flex flex-col gap-5">
					<DownloadShareCard />
					<ShareWithEducatorCard
						teacherEmail={teacherEmail}
						onTeacherEmailChange={setTeacherEmail}
						onSend={() => {
							// TODO: handle send
						}}
						accessCode="XK7P-M4N2"
					/>
					<NextStepsCard primaryHref="/profile" secondaryHref="/start" />
				</div>
			</div>
		</div>
	);
}
