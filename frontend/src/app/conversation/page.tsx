"use client";

import { useState } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { Nav } from "@/components/ui/Nav";
import { ChatBubble } from "@/components/ui/Chat";
import { ChatInput } from "@/components/ui/Chat";
import { ProfileProgress } from "@/components/ui/ProfileProgress";
import type { ProfileSectionData } from "@/components/ui/ProfileProgress";

const MOCK_MESSAGES = [
	{
		id: "1",
		sender: "ai" as const,
		senderName: "AI Assistant",
		message:
			"Hello! I'm excited to help you create Sarah's Genius Summary. Let's start by talking about her interests. What activities does Sarah enjoy in her free time?",
		timestamp: "10:30 AM",
	},
	{
		id: "2",
		sender: "user" as const,
		senderName: "You",
		message:
			"She loves drawing and painting. She spends hours creating art and is always excited to show me her latest work.",
		timestamp: "10:31 AM",
	},
	{
		id: "3",
		sender: "ai" as const,
		senderName: "AI Assistant",
		message:
			"That's wonderful! Creative expression is such an important part of Interest Awareness. Can you tell me what specific aspects of art she's most drawn to?",
		timestamp: "10:32 AM",
	},
];

const MOCK_SECTIONS: ProfileSectionData[] = [
	{
		title: "Interest Awareness",
		status: "complete",
		description:
			"Sarah demonstrates strong creative interests, particularly in visual arts. She shows intrinsic motivation and sustained engagement with artistic activities.",
	},
	{
		title: "Racial/Cultural Pride",
		status: "in-progress",
		description: "Building profile section...",
	},
	{ title: "Can-Do Attitude", status: "not-started" },
	{ title: "Multicultural Navigation", status: "not-started" },
	{ title: "Selective Trust", status: "not-started" },
	{ title: "Social Justice", status: "not-started" },
];

export default function ConversationPage() {
	const [inputValue, setInputValue] = useState("");

	const chatPanel = (
		<div className="flex h-full flex-col rounded-2xl bg-white">
			<div className="flex-1 space-y-6 overflow-y-auto p-5 md:p-8">
				{MOCK_MESSAGES.map((msg) => (
					<ChatBubble key={msg.id} {...msg} />
				))}
			</div>
			<ChatInput
				value={inputValue}
				onChange={setInputValue}
				onSend={() => {
					// TODO: handle send
					setInputValue("");
				}}
			/>
		</div>
	);

	const profilePanel = (
		<div className="rounded-2xl bg-white p-5 md:p-8">
			<ProfileProgress
				studentName="Sarah"
				percentComplete={42}
				sections={MOCK_SECTIONS}
			/>
		</div>
	);

	return (
		<div className="relative flex min-h-screen flex-col bg-brand-brown isolate">
			<Nav
				className="relative z-20"
				actions={[
					{
						label: "Sarah's Genius Summary 42% Complete",
						href: "/conversation",
						variant: "orange",
					},
					{ label: "Help", href: "/help", variant: "outlined" },
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

			{/* ── Desktop: side-by-side panels ── */}
			<div className="relative z-10 hidden flex-1 gap-5 p-5 md:flex lg:gap-6 lg:p-6">
				<div className="flex w-3/5 flex-col">{chatPanel}</div>
				<div className="w-2/5 overflow-y-auto">{profilePanel}</div>
			</div>

			{/* ── Mobile: Radix Tabs ── */}
			<Tabs.Root
				defaultValue="chat"
				className="relative z-10 flex flex-1 flex-col md:hidden"
			>
				<Tabs.List className="flex bg-white">
					<Tabs.Trigger
						value="chat"
						className="flex-1 border-b-2 border-transparent py-3 text-center text-sm font-semibold uppercase tracking-wider text-brand-brown transition-colors data-[state=active]:border-green-600 data-[state=active]:text-green-600"
					>
						Chat
					</Tabs.Trigger>
					<Tabs.Trigger
						value="profile"
						className="flex-1 border-b-2 border-transparent py-3 text-center text-sm font-semibold uppercase tracking-wider text-brand-brown transition-colors data-[state=active]:border-green-600 data-[state=active]:text-green-600"
					>
						Profile
					</Tabs.Trigger>
				</Tabs.List>

				<Tabs.Content value="chat" className="flex flex-1 flex-col p-4">
					{chatPanel}
				</Tabs.Content>
				<Tabs.Content value="profile" className="flex-1 p-4">
					{profilePanel}
				</Tabs.Content>
			</Tabs.Root>
		</div>
	);
}
