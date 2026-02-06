import Image from "next/image";
import { cn } from "@/lib/utils/utils";

export type ChatBubbleProps = {
	/** Who sent the message */
	sender: "ai" | "user";
	/** Display name above the bubble */
	senderName: string;
	/** Message text */
	message: string;
	/** Formatted timestamp (e.g. "10:30 AM") */
	timestamp: string;
	/** Avatar image source — defaults to vow logo */
	avatarSrc?: string;
	className?: string;
};

export function ChatBubble({
	sender,
	senderName,
	message,
	timestamp,
	avatarSrc = "/vow-logo.svg",
	className,
}: ChatBubbleProps) {
	const isUser = sender === "user";

	return (
		<div
			className={cn(
				"flex flex-col",
				isUser ? "items-end" : "items-start",
				className,
			)}
		>
			{/* Avatar + name */}
			<div
				className={cn("flex items-center gap-2", isUser && "flex-row-reverse")}
			>
				<div
					className={cn(
						isUser ? "bg-brand-blue" : "bg-brand-orange",
						"flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full md:size-10",
					)}
				>
					<Image
						src={avatarSrc}
						alt={`${senderName} avatar`}
						width={28}
						height={12}
						className="invert"
					/>
				</div>
				<span className="text-xs font-semibold text-brand-brown md:text-sm">
					{senderName}
				</span>
			</div>

			{/* Bubble */}
			<div
				className={cn(
					"mt-1.5 max-w-[85%] rounded-2xl px-5 py-3.5 text-sm leading-relaxed text-white md:max-w-md md:text-base",
					isUser ? "bg-brand-blue" : "bg-brand-orange",
					isUser ? "mr-10 md:mr-12" : "ml-10 md:ml-12",
				)}
			>
				{message}
			</div>

			{/* Timestamp */}
			<span
				className={cn(
					"mt-1 text-xs text-brand-brown/50",
					isUser ? "mr-10 md:mr-12" : "ml-10 md:ml-12",
				)}
			>
				{timestamp}
			</span>
		</div>
	);
}

export default ChatBubble;
