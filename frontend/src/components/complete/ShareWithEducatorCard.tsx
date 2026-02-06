import { ArrowRightIcon } from "@/components/icons";

interface ShareWithEducatorCardProps {
	teacherEmail: string;
	onTeacherEmailChange: (value: string) => void;
	onSend: () => void;
	accessCode: string;
}

export function ShareWithEducatorCard({
	teacherEmail,
	onTeacherEmailChange,
	onSend,
	accessCode,
}: ShareWithEducatorCardProps) {
	return (
		<div className="rounded-2xl bg-white p-6">
			<h2 className="font-display text-xl font-bold text-brand-brown">
				Share with Educator
			</h2>
			<label htmlFor="share-educator-email" className="sr-only">
				Teacher email address
			</label>
			<input
				id="share-educator-email"
				type="email"
				placeholder="Teacher's email address"
				aria-label="Teacher email address"
				value={teacherEmail}
				onChange={(e) => onTeacherEmailChange(e.target.value)}
				className="mt-4 h-14 w-full rounded-lg border border-brand-cream bg-white px-4 text-base text-brand-brown outline-none transition placeholder:text-brand-brown/40 focus:border-brand-brown/40"
			/>
			<button
				type="button"
				onClick={onSend}
				className="mt-4 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-brand-brown text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-brand-brown/90"
			>
				Send
				<ArrowRightIcon />
			</button>
			<p className="mt-3 text-sm text-brand-brown/60">
				You can also share your access code:{" "}
				<span className="font-bold text-brand-brown">{accessCode}</span>
			</p>
		</div>
	);
}
