"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useParams, useRouter, notFound } from "next/navigation";
import * as Tabs from "@radix-ui/react-tabs";
import { Nav } from "@/components/ui/Nav";
import {
	ProfileProgress,
	type ProfileSectionData,
} from "@/components/ui/ProfileProgress";
import { DecorativeSwooshes } from "@/components/complete";
import {
	ChatPanel,
	ConversationSkeleton,
	ProfileCompleteModal,
	type ChatMsg,
} from "@/components/conversation";
import { useConversation } from "@/lib/hooks/useConversation";
import { getAccessToken } from "@/lib/utils/cookies";
import { formatTime } from "@/lib/utils/utils";

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:3001";

export default function ConversationPage() {
	const params = useParams();
	const router = useRouter();
	const id = params.id as string;
	const { data, isLoading, error } = useConversation(id);

	const initialMessages = useMemo(() => {
		if (!data?.conversation.messages) return [];
		return data.conversation.messages.map((m) => ({
			id: m._id,
			sender: m.sender,
			senderName: m.senderName,
			message: m.message,
			timestamp: formatTime(m.timestamp),
		}));
	}, [data?.conversation.messages]);

	const [messages, setMessages] = useState<ChatMsg[]>(initialMessages);
	const [inputValue, setInputValue] = useState("");
	const [isAiTyping, setIsAiTyping] = useState(false);
	const [streamingMessage, setStreamingMessage] = useState<string | null>(null);
	const [isConnected, setIsConnected] = useState(false);
	const [profileState, setProfileState] = useState<{
		percentComplete: number;
		sections: ProfileSectionData[];
		status: string;
	} | null>(null);
	const [showCompleteModal, setShowCompleteModal] = useState(false);
	const [streamingSummary, setStreamingSummary] = useState<{
		sectionTitle: string;
		content: string;
	} | null>(null);

	const wsRef = useRef<WebSocket | null>(null);
	const hasJoined = useRef(false);

	// Redirect to profile page if already complete
	useEffect(() => {
		if (data && data.profile.status === "complete") {
			router.replace(`/profile/${id}`);
		}
	}, [data, id, router]);

	// Show completion modal when profile completes during chat
	useEffect(() => {
		if (profileState?.status === "complete") {
			setShowCompleteModal(true);
		}
	}, [profileState?.status]);

	useEffect(() => {
		setMessages(initialMessages);
	}, [initialMessages]);

	useEffect(() => {
		const containers = document.querySelectorAll<HTMLElement>(
			"[data-chat-messages]",
		);
		containers.forEach((container) => {
			if (container.offsetHeight > 0) {
				container.scrollTo({
					top: container.scrollHeight,
					behavior: "smooth",
				});
			}
		});
	}, [messages, streamingMessage, isAiTyping]);

	useEffect(() => {
		if (!id || !data) return;

		const token = getAccessToken();
		if (!token) return;

		const ws = new WebSocket(WS_URL);
		wsRef.current = ws;

		ws.onopen = () => {
			setIsConnected(true);
			ws.send(
				JSON.stringify({
					type: "join",
					payload: { token, conversationId: id },
				}),
			);
			hasJoined.current = true;
		};

		ws.onmessage = (event) => {
			const msg = JSON.parse(event.data);

			switch (msg.type) {
				case "message_saved": {
					setMessages((prev) => [
						...prev,
						{
							id: msg.payload.id,
							sender: msg.payload.sender,
							senderName: msg.payload.senderName,
							message: msg.payload.message,
							timestamp: formatTime(msg.payload.timestamp),
						},
					]);
					break;
				}
				case "ai_typing": {
					setIsAiTyping(true);
					break;
				}
				case "ai_stream_start": {
					setIsAiTyping(false);
					setStreamingMessage("");
					break;
				}
				case "ai_stream_chunk": {
					setStreamingMessage(msg.payload.full);
					break;
				}
				case "ai_stream_end": {
					setStreamingMessage(msg.payload.message);
					setTimeout(() => {
						setStreamingMessage(null);
						setMessages((prev) => [
							...prev,
							{
								id: msg.payload.id,
								sender: msg.payload.sender,
								senderName: msg.payload.senderName,
								message: msg.payload.message,
								timestamp: formatTime(msg.payload.timestamp),
							},
						]);
					}, 60);
					break;
				}
				case "section_content_chunk": {
					setStreamingSummary({
						sectionTitle: msg.payload.sectionTitle,
						content: msg.payload.content,
					});
					break;
				}
				case "section_complete": {
					setStreamingSummary(null);
					setProfileState({
						percentComplete: msg.payload.percentComplete,
						sections: msg.payload.sections,
						status: msg.payload.status,
					});
					break;
				}
				case "error": {
					console.error("WebSocket error:", msg.payload.message);
					break;
				}
			}
		};

		ws.onclose = () => {
			setIsConnected(false);
			hasJoined.current = false;
		};

		return () => {
			ws.close();
			wsRef.current = null;
		};
	}, [id, data]);

	const handleSend = useCallback(() => {
		if (
			!inputValue.trim() ||
			!wsRef.current ||
			wsRef.current.readyState !== WebSocket.OPEN
		)
			return;

		wsRef.current.send(
			JSON.stringify({
				type: "send_message",
				payload: { message: inputValue.trim() },
			}),
		);
		setInputValue("");
	}, [inputValue]);

	if (isLoading) {
		return <ConversationSkeleton />;
	}

	if (error) {
		if (error.status === 404) notFound();
		throw error;
	}

	if (!data) {
		notFound();
	}

	const { profile } = data;
	const studentName = profile.studentName;
	const currentPercent =
		profileState?.percentComplete ?? profile.percentComplete;
	const baseSections = profileState?.sections ?? profile.sections;
	const currentSections = baseSections.map((section) => {
		if (streamingSummary && section.title === streamingSummary.sectionTitle) {
			return { ...section, description: streamingSummary.content };
		}
		return section;
	});
	const currentStatus = profileState?.status ?? profile.status;
	const isProfileComplete = currentStatus === "complete";
	const isSendDisabled =
		!isConnected ||
		isAiTyping ||
		streamingMessage !== null ||
		isProfileComplete;

	const profilePanel = (
		<div className="h-full min-h-0 rounded-2xl bg-white p-5 md:p-8 overflow-y-auto">
			<ProfileProgress
				studentName={studentName}
				percentComplete={currentPercent}
				sections={currentSections}
			/>
		</div>
	);

	return (
		<div className="relative flex h-screen flex-col bg-brand-brown isolate overflow-hidden">
			<Nav
				className="relative z-20 shrink-0"
				actions={[
					{
						label: `${currentPercent}% Complete`,
						href: `/conversation/${id}`,
						variant: "orange",
					},
					{
						label: "Continue Later",
						href: `/dashboard`,
						variant: "outlined",
					},
				]}
			/>

			<DecorativeSwooshes />

			{/* Desktop: side-by-side panels */}
			<div className="relative z-10 hidden flex-1 gap-5 p-5 md:flex lg:gap-6 lg:p-6 min-h-0">
				<div className="flex w-3/5 flex-col h-full">
					<ChatPanel
						messages={messages}
						streamingMessage={streamingMessage}
						isAiTyping={isAiTyping}
						inputValue={inputValue}
						onInputChange={setInputValue}
						onSend={handleSend}
						isSendDisabled={isSendDisabled}
						isProfileComplete={isProfileComplete}
					/>
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
					<ChatPanel
						messages={messages}
						streamingMessage={streamingMessage}
						isAiTyping={isAiTyping}
						inputValue={inputValue}
						onInputChange={setInputValue}
						onSend={handleSend}
						isSendDisabled={isSendDisabled}
						isProfileComplete={isProfileComplete}
					/>
				</Tabs.Content>
				<Tabs.Content
					value="profile"
					className="flex-1 p-4 overflow-hidden min-h-0"
				>
					{profilePanel}
				</Tabs.Content>
			</Tabs.Root>

			<ProfileCompleteModal
				open={showCompleteModal}
				onOpenChange={setShowCompleteModal}
				studentName={studentName}
				onViewProfile={() => router.push(`/profile/${id}`)}
			/>
		</div>
	);
}
