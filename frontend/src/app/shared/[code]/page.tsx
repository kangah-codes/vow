"use client";

import { useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import * as Tabs from "@radix-ui/react-tabs";
import { Nav } from "@/components/ui/Nav";
import { ChatBubble, ChatSkeleton } from "@/components/ui/Chat";
import { ProfileProgress } from "@/components/ui/ProfileProgress";
import { useSharedConversation } from "@/lib/hooks/useSharedConversation";
import { useCurrentUser } from "@/lib/hooks/useCurrentUser";

function formatTime(ts: string | Date): string {
	const d = new Date(ts);
	return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

export default function SharedConversationPage() {
	const params = useParams();
	const code = params.code as string;
	const router = useRouter();
	const { data, isLoading, error } = useSharedConversation(code);
	const { data: user } = useCurrentUser();

	// If the logged-in user owns this conversation, redirect to the full chat
	useEffect(() => {
		if (data && user && data.conversation.userId === user.id) {
			router.replace(`/conversation/${data.conversation._id}`);
		}
	}, [data, user, router]);

	const messages = useMemo(() => {
		if (!data?.conversation.messages) return [];
		return data?.conversation.messages.map((m) => ({
			id: m._id,
			sender: m.sender,
			senderName: m.senderName,
			message: m.message,
			timestamp: formatTime(m.timestamp),
		}));
	}, [data?.conversation.messages]);

	if (isLoading) {
		return (
			<div className="relative flex h-screen flex-col bg-brand-brown isolate overflow-hidden">
				<Nav
					className="relative z-20 shrink-0"
					actions={[{ label: "Help", href: "/help", variant: "outlined" }]}
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

				{/* Desktop skeleton */}
				<div className="relative z-10 hidden flex-1 gap-5 p-5 md:flex lg:gap-6 lg:p-6 min-h-0">
					<div className="flex w-3/5 flex-col h-full">
						<ChatSkeleton />
					</div>
					<div className="w-2/5 h-full">
						<div className="h-full rounded-2xl bg-white backdrop-blur-sm p-5 md:p-8 space-y-4">
							<div className="h-5 w-32 animate-pulse rounded bg-gray-200" />
							<div className="h-3 w-full animate-pulse rounded bg-gray-200" />
							<div className="h-3 w-3/4 animate-pulse rounded bg-gray-200" />
							<div className="mt-6 space-y-3">
								{[1, 2, 3, 4].map((i) => (
									<div
										key={i}
										className="h-10 w-full animate-pulse rounded-lg bg-gray-200"
									/>
								))}
							</div>
						</div>
					</div>
				</div>

				{/* Mobile skeleton */}
				<div className="relative z-10 flex flex-1 flex-col p-4 md:hidden min-h-0">
					<ChatSkeleton />
				</div>
			</div>
		);
	}

	if (error) {
		const message =
			error.status === 410
				? "This access code has expired. Access codes are valid for 30 days."
				: error.status === 404
					? "Invalid access code. Please check and try again."
					: "Something went wrong while loading the conversation.";

		return (
			<div className="flex min-h-screen flex-col bg-brand-brown">
				<Nav
					actions={[{ label: "Help", href: "/help", variant: "outlined" }]}
				/>
				<div className="flex flex-1 items-center justify-center px-4">
					<div className="w-full max-w-md rounded-2xl bg-white p-8 text-center">
						<span className="text-5xl" aria-hidden="true">
							{error.status === 410 ? "⏱️" : "🔍"}
						</span>
						<h1 className="mt-4 font-display text-2xl font-bold text-brand-brown">
							{error.status === 410 ? "Code Expired" : "Conversation Not Found"}
						</h1>
						<p className="mt-3 text-sm text-brand-brown/60">{message}</p>
						<div className="mt-6 flex flex-col gap-3">
							<Link
								href="/resume"
								className="inline-flex h-12 items-center justify-center rounded-full bg-brand-brown px-8 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-brand-brown/90"
							>
								Try Another Code
							</Link>
							<Link
								href="/"
								className="inline-flex h-12 items-center justify-center rounded-full border-2 border-brand-brown px-8 text-sm font-bold uppercase tracking-wider text-brand-brown transition-colors hover:bg-brand-brown/5"
							>
								Go Home
							</Link>
						</div>
					</div>
				</div>
			</div>
		);
	}

	if (!data) return null;

	const { profile } = data;

	const chatPanel = (
		<div className="flex h-full flex-col rounded-2xl bg-white min-h-0">
			<div className="flex-1 space-y-6 overflow-y-auto p-5 md:p-8 min-h-0">
				{messages.map((msg) => (
					<ChatBubble key={msg.id} {...msg} />
				))}
			</div>

			{/* Read-only banner */}
			<div className="shrink-0 border-t border-brand-cream/60 px-4 py-4 text-center">
				<p className="text-sm text-brand-brown/50">
					This is a shared, read-only view of this conversation.
				</p>
			</div>
		</div>
	);

	const profilePanel = (
		<div className="h-full rounded-2xl bg-white p-5 md:p-8 overflow-y-auto">
			<ProfileProgress
				studentName={profile.studentName}
				percentComplete={profile.percentComplete}
				sections={profile.sections}
			/>
		</div>
	);

	return (
		<div className="relative flex h-screen flex-col bg-brand-brown isolate overflow-hidden">
			<Nav
				className="relative z-20 shrink-0"
				actions={[
					{
						label: `${profile.percentComplete}% Complete`,
						href: `/shared/${code}`,
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

			{/* Desktop: side-by-side panels */}
			<div className="relative z-10 hidden flex-1 gap-5 p-5 md:flex lg:gap-6 lg:p-6 min-h-0">
				<div className="flex w-3/5 flex-col h-full">{chatPanel}</div>
				<div className="w-2/5 h-full">{profilePanel}</div>
			</div>

			{/* Mobile: Radix Tabs */}
			<Tabs.Root
				defaultValue="chat"
				className="relative z-10 flex flex-1 flex-col md:hidden min-h-0"
			>
				<Tabs.List className="flex bg-white shrink-0">
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

				<Tabs.Content
					value="chat"
					className="flex flex-1 flex-col p-4 overflow-hidden min-h-0"
				>
					{chatPanel}
				</Tabs.Content>
				<Tabs.Content
					value="profile"
					className="flex-1 p-4 overflow-hidden min-h-0"
				>
					{profilePanel}
				</Tabs.Content>
			</Tabs.Root>
		</div>
	);
}
