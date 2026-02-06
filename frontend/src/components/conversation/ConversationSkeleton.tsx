import { Nav } from "@/components/ui/Nav";
import { ChatSkeleton } from "@/components/ui/Chat";
import { DecorativeSwooshes } from "@/components/complete";

export function ConversationSkeleton() {
	return (
		<div className="relative flex h-screen flex-col bg-brand-brown isolate overflow-hidden">
			<Nav
				className="relative z-20 shrink-0"
				actions={[{ label: "Help", href: "/help", variant: "outlined" }]}
			/>

			<DecorativeSwooshes />

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
