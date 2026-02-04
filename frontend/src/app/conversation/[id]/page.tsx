"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useParams } from "next/navigation";
import * as Tabs from "@radix-ui/react-tabs";
import { Nav } from "@/components/ui/Nav";
import {
	ChatBubble,
	ChatInput,
	ChatSkeleton,
	TypingIndicator,
} from "@/components/ui/Chat";
import { ProfileProgress } from "@/components/ui/ProfileProgress";
import { useConversation } from "@/lib/hooks/useConversation";

const WS_URL = "ws://localhost:3001";

interface ChatMsg {
	id: string;
	sender: "ai" | "user";
	senderName: string;
	message: string;
	timestamp: string;
}

function formatTime(ts: string | Date): string {
	const d = new Date(ts);
	return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function getAccessToken(): string | undefined {
	if (typeof document === "undefined") return undefined;
	const match = document.cookie.match(/(?:^|; )accessToken=([^;]*)/);
	return match?.[1];
}

export default function ConversationPage() {
	const params = useParams();
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

	const wsRef = useRef<WebSocket | null>(null);
	const hasJoined = useRef(false);

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
		throw error;
	}

	if (!data) {
		throw new Error("Conversation not found");
	}

	const { profile } = data;
	const studentName = profile.studentName;
	const isSendDisabled =
		!isConnected || isAiTyping || streamingMessage !== null;

	const chatPanel = (
		<div className="flex h-full flex-col rounded-2xl bg-white min-h-0">
			<div
				data-chat-messages
				className="flex-1 space-y-6 overflow-y-auto p-5 md:p-8 min-h-0"
			>
				{messages.map((msg) => (
					<ChatBubble key={msg.id} {...msg} />
				))}

				{streamingMessage !== null && (
					<ChatBubble
						sender="ai"
						senderName="Genius Guide"
						message={streamingMessage || "\u00A0"}
						timestamp={formatTime(new Date())}
						className="animate-in fade-in"
					/>
				)}

				{isAiTyping && <TypingIndicator />}

				<div className="h-px w-full" />
			</div>

			{/* Fixed Input Area */}
			<div className="shrink-0">
				<ChatInput
					value={inputValue}
					onChange={setInputValue}
					onSend={handleSend}
					placeholder={
						isSendDisabled
							? "Waiting for response..."
							: "Type your message here..."
					}
				/>
			</div>
		</div>
	);

	const profilePanel = (
		<div className="h-full min-h-0 rounded-2xl bg-white p-5 md:p-8 overflow-y-auto">
			<ProfileProgress
				studentName={studentName}
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
