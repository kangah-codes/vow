"use client";

import { useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import * as Tabs from "@radix-ui/react-tabs";
import { Nav } from "@/components/ui/Nav";
import { ProfileProgress } from "@/components/ui/ProfileProgress";
import { DecorativeSwooshes } from "@/components/complete";
import { ConversationSkeleton, type ChatMsg } from "@/components/conversation";
import { SharedError, ReadOnlyChatPanel } from "@/components/shared";
import { useSharedConversation } from "@/lib/hooks/useSharedConversation";
import { useCurrentUser } from "@/lib/hooks/useCurrentUser";
import { formatTime } from "@/lib/utils/utils";

export default function SharedConversationPage() {
	const params = useParams();
	const code = params.code as string;
	const router = useRouter();
	const { data, isLoading, error } = useSharedConversation(code);
	const { data: user } = useCurrentUser();

	// if the logged-in user owns this conversation redirect to the full chat
	useEffect(() => {
		if (data && user && data.conversation.userId === user.id) {
			router.replace(`/conversation/${data.conversation._id}`);
		}
	}, [data, user, router]);

	const messages: ChatMsg[] = useMemo(() => {
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
		return <ConversationSkeleton />;
	}

	if (error) {
		return <SharedError status={error.status} />;
	}

	if (!data) return null;

	const { profile } = data;

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

			<DecorativeSwooshes />

			{/* Desktop: side-by-side panels */}
			<div className="relative z-10 hidden flex-1 gap-5 p-5 md:flex lg:gap-6 lg:p-6 min-h-0">
				<div className="flex w-3/5 flex-col h-full">
					<ReadOnlyChatPanel messages={messages} />
				</div>
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
					<ReadOnlyChatPanel messages={messages} />
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
