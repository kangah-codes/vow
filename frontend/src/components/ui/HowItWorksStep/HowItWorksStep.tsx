import Image from "next/image";
import { cn } from "@/lib/utils";

export type HowItWorksStepProps = {
	/** Step number (1, 2, 3, etc.) */
	step: number;
	/** Description text */
	description: string;
	/** Image source path */
	imageSrc: string;
	/** Image alt text */
	imageAlt: string;
	className?: string;
};

export function HowItWorksStep({
	step,
	description,
	imageSrc,
	imageAlt,
	className,
}: HowItWorksStepProps) {
	return (
		<div className={cn("flex flex-col", className)}>
			<div className="relative aspect-5/3 w-full overflow-hidden rounded-xl">
				<Image
					src={imageSrc}
					alt={imageAlt}
					fill
					className="object-cover"
					sizes="(max-width: 768px) 100vw, 33vw"
				/>
			</div>
			<div className="mt-4 flex items-start gap-3">
				<span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-brand-orange text-lg font-bold text-white">
					{step}
				</span>
				<p className="pt-1.5 text-lg font-medium leading-snug text-brand-brown md:text-xl">
					{description}
				</p>
			</div>
		</div>
	);
}

export default HowItWorksStep;
