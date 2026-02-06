import Image from "next/image";
import { cn } from "@/lib/utils/utils";

export type TypingIndicatorProps = {
	senderName?: string;
	avatarSrc?: string;
	className?: string;
};

export function TypingIndicator({
	senderName = "Genius Guide",
	avatarSrc = "/vow-logo.svg",
	className,
}: TypingIndicatorProps) {
	return (
		<div
			className={cn("flex flex-col items-start", className)}
			role="status"
			aria-live="polite"
		>
			<div className="flex items-center gap-2">
				<div className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand-orange md:size-10">
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

			<div className="ml-10 mt-1.5 flex items-center gap-1.5 rounded-2xl bg-brand-orange px-5 py-4 md:ml-12">
				<span className="sr-only">{senderName} is typing</span>
				<span className="size-2 animate-bounce rounded-full bg-white/80 [animation-delay:0ms]" />
				<span className="size-2 animate-bounce rounded-full bg-white/80 [animation-delay:150ms]" />
				<span className="size-2 animate-bounce rounded-full bg-white/80 [animation-delay:300ms]" />
			</div>
		</div>
	);
}

export default TypingIndicator;
