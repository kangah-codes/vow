export function ProfilesSkeleton() {
	return (
		<div className="mt-6 flex items-stretch gap-4 overflow-hidden pb-4">
			{[1, 2, 3].map((i) => (
				<div
					key={i}
					className="flex-none w-full md:w-[calc(33.333%-0.667rem)] rounded-xl border border-stone-200 bg-white p-5"
				>
					<div className="flex items-start justify-between gap-3">
						<div className="h-5 w-28 animate-pulse rounded bg-gray-200" />
						<div className="h-6 w-20 animate-pulse rounded-full bg-gray-200" />
					</div>
					<div className="mt-2 h-3 w-40 animate-pulse rounded bg-gray-100" />
					<div className="mt-4">
						<div className="h-2 w-full animate-pulse rounded-full bg-gray-100" />
						<div className="mt-1.5 h-3 w-20 animate-pulse rounded bg-gray-100" />
					</div>
					<div className="mt-4 flex gap-2">
						<div className="h-9 w-20 animate-pulse rounded-full bg-gray-200" />
						<div className="h-9 w-24 animate-pulse rounded-full bg-gray-100" />
					</div>
				</div>
			))}
		</div>
	);
}

export function AccountSettingsSkeleton() {
	return (
		<section className="rounded-xl border border-stone-200 bg-white p-5 md:p-8">
			<div className="h-6 w-40 animate-pulse rounded bg-gray-200" />
			<div className="mt-6 divide-y divide-stone-100">
				{[1, 2, 3, 4].map((i) => (
					<div key={i} className="py-4 first:pt-0">
						<div className="h-3 w-16 animate-pulse rounded bg-gray-200" />
						<div className="mt-2 h-3 w-48 animate-pulse rounded bg-gray-100" />
						{i < 4 && (
							<div className="mt-2 h-3 w-20 animate-pulse rounded bg-gray-100" />
						)}
					</div>
				))}
			</div>
		</section>
	);
}
