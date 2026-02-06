import { ChatBubble } from "@/components/ui/Chat";
import type { ChatMsg } from "@/components/conversation";

interface ReadOnlyChatPanelProps {
	messages: ChatMsg[];
}

export function ReadOnlyChatPanel({ messages }: ReadOnlyChatPanelProps) {
	return (
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
}
