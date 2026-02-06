import { DownloadIcon, EmailIcon, PrintIcon } from "@/components/icons";

interface DownloadShareCardProps {
	onDownload?: () => void;
	onEmail?: () => void;
	onPrint?: () => void;
}

export function DownloadShareCard({
	onDownload,
	onEmail,
	onPrint,
}: DownloadShareCardProps = {}) {
	return (
		<div className="rounded-2xl bg-white p-6">
			<h2 className="font-display text-xl font-bold text-brand-brown">
				Download &amp; Share
			</h2>
			<div className="mt-4 grid grid-cols-3 gap-3">
				<button
					type="button"
					onClick={onDownload}
					className="flex flex-col items-center gap-2 rounded-xl border border-brand-cream/60 p-4 text-brand-brown transition-colors hover:bg-stone-50"
				>
					<DownloadIcon />
					<span className="text-xs font-medium">Download PDF</span>
				</button>
				<button
					type="button"
					onClick={onEmail}
					className="flex flex-col items-center gap-2 rounded-xl border border-brand-cream/60 p-4 text-brand-brown transition-colors hover:bg-stone-50"
				>
					<EmailIcon />
					<span className="text-xs font-medium">Email Profile</span>
				</button>
				<button
					type="button"
					onClick={onPrint}
					className="flex flex-col items-center gap-2 rounded-xl border border-brand-cream/60 p-4 text-brand-brown transition-colors hover:bg-stone-50"
				>
					<PrintIcon />
					<span className="text-xs font-medium">Print</span>
				</button>
			</div>
		</div>
	);
}
