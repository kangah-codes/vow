import { cn } from "@/lib/utils";

function BubbleSkeleton({ side }: { side: "left" | "right" }) {
	const isRight = side === "right";

	return (
		<div className={cn("flex flex-col", isRight ? "items-end" : "items-start")}>
			{/* Avatar + name */}
			<div
				className={cn("flex items-center gap-2", isRight && "flex-row-reverse")}
			>
				<div className="size-8 shrink-0 animate-pulse rounded-full bg-gray-300 md:size-10" />
				<div className="h-3 w-20 animate-pulse rounded bg-gray-300" />
			</div>

			{/* Bubble */}
			<div
				className={cn(
					"mt-1.5 animate-pulse rounded-2xl px-5 py-3.5",
					isRight ? "mr-10 md:mr-12" : "ml-10 md:ml-12",
					isRight ? "bg-gray-300" : "bg-gray-300",
				)}
			>
				<div className="space-y-2">
					<div
						className={cn(
							"h-3 rounded",
							isRight ? "w-36" : "w-48",
							"bg-gray-300",
						)}
					/>
					<div
						className={cn(
							"h-3 rounded",
							isRight ? "w-24" : "w-40",
							"bg-gray-300",
						)}
					/>
					{side === "left" && <div className="h-3 w-28 rounded bg-gray-300" />}
				</div>
			</div>

			{/* Timestamp */}
			<div
				className={cn(
					"mt-1 h-2.5 w-12 animate-pulse rounded bg-gray-300",
					isRight ? "mr-10 md:mr-12" : "ml-10 md:ml-12",
				)}
			/>
		</div>
	);
}

export function ChatSkeleton() {
	return (
		<div className="flex h-full flex-col rounded-2xl bg-white min-h-0">
			{/* Messages area */}
			<div className="flex-1 space-y-6 p-5 md:p-8">
				<BubbleSkeleton side="left" />
				<BubbleSkeleton side="right" />
				<BubbleSkeleton side="left" />
				<BubbleSkeleton side="right" />
				<BubbleSkeleton side="left" />
			</div>

			{/* Input area skeleton */}
			<div className="shrink-0 border-t border-white/10 px-4 py-3 md:px-6 md:py-4">
				<div className="flex items-center gap-3">
					<div className="h-10 flex-1 animate-pulse rounded-full bg-gray-300 md:h-12" />
					<div className="h-10 w-24 animate-pulse rounded-full bg-gray-300 md:h-12" />
				</div>
			</div>
		</div>
	);
}

export default ChatSkeleton;
