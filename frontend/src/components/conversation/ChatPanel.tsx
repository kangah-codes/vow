import {
	ChatBubble,
	ChatInput,
	TypingIndicator,
} from "@/components/ui/Chat";

export interface ChatMsg {
	id: string;
	sender: "ai" | "user";
	senderName: string;
	message: string;
	timestamp: string;
}

interface ChatPanelProps {
	messages: ChatMsg[];
	streamingMessage: string | null;
	isAiTyping: boolean;
	inputValue: string;
	onInputChange: (value: string) => void;
	onSend: () => void;
	isSendDisabled: boolean;
	isProfileComplete: boolean;
}

export function ChatPanel({
	messages,
	streamingMessage,
	isAiTyping,
	inputValue,
	onInputChange,
	onSend,
	isSendDisabled,
	isProfileComplete,
}: ChatPanelProps) {
	return (
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
						timestamp={new Date().toLocaleTimeString([], {
							hour: "numeric",
							minute: "2-digit",
						})}
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
					onChange={onInputChange}
					onSend={onSend}
					disabled={isSendDisabled}
					placeholder={
						isProfileComplete
							? "This profile is complete"
							: isSendDisabled
								? "Waiting for response..."
								: "Type your message here..."
					}
				/>
			</div>
		</div>
	);
}
