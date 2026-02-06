import { Nav } from "@/components/ui/Nav";

export function ProfileSkeleton() {
	return (
		<div className="relative isolate flex min-h-screen flex-col bg-brand-brown">
			<Nav
				className="relative z-20"
				actions={[{ label: "Help", href: "/help", variant: "outlined" }]}
			/>
			<div className="relative z-10 grid flex-1 grid-cols-1 gap-5 p-4 md:grid-cols-[3fr_2fr] md:p-6">
				<div className="rounded-2xl bg-white p-6 md:p-10">
					<div className="flex flex-col items-center gap-4">
						<div className="h-12 w-12 animate-pulse rounded-full bg-gray-200" />
						<div className="h-8 w-64 animate-pulse rounded bg-gray-200" />
						<div className="h-4 w-48 animate-pulse rounded bg-gray-200" />
					</div>
					<div className="mt-8 space-y-3">
						{[1, 2, 3, 4, 5, 6].map((i) => (
							<div
								key={i}
								className="h-16 w-full animate-pulse rounded-lg bg-gray-100"
							/>
						))}
					</div>
				</div>
				<div className="flex flex-col gap-5">
					<div className="rounded-2xl bg-white p-6">
						<div className="h-6 w-40 animate-pulse rounded bg-gray-200" />
						<div className="mt-4 grid grid-cols-3 gap-3">
							{[1, 2, 3].map((i) => (
								<div
									key={i}
									className="h-20 animate-pulse rounded-xl bg-gray-100"
								/>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
