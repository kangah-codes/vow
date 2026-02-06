import { useRef } from "react";
import type { Profile } from "@/lib/hooks/useProfiles";
import { ProfileCard } from "./ProfileCard";

interface ProfilesCarouselProps {
	profiles: Profile[];
	onDelete: (id: string) => void;
	onShare: (accessCode: string) => void;
	onDownload: (studentName: string, sections: Profile["sections"]) => void;
	deletingId: string | null;
}

export function ProfilesCarousel({
	profiles,
	onDelete,
	onShare,
	onDownload,
	deletingId,
}: ProfilesCarouselProps) {
	const scrollContainerRef = useRef<HTMLDivElement>(null);

	return (
		<div className="relative mt-6">
			{/* Scrollable Container */}
			<div
				ref={scrollContainerRef}
				className="flex items-stretch gap-4 overflow-x-scroll snap-x snap-mandatory scroll-smooth pb-4"
			>
				{profiles.map((profile) => (
					<div
						key={profile._id}
						className="flex-none w-full md:w-[calc(33.333%-0.667rem)] snap-start"
					>
						<ProfileCard
							profile={profile}
							onDelete={onDelete}
							onShare={onShare}
							onDownload={onDownload}
							isDeleting={deletingId === profile._id}
						/>
					</div>
				))}
			</div>
		</div>
	);
}
