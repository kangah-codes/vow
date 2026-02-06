import type { ProfileSectionData } from "@/components/ui/ProfileProgress";

function buildProfileHtml(
	studentName: string,
	sections: ProfileSectionData[],
): string {
	const sectionCards = sections
		.map((s) => {
			const isComplete = s.status === "complete";
			const bg = isComplete
				? "background:#f0fdf4;border-color:#bbf7d0"
				: "background:#fffbeb;border-color:#fde68a";
			const badgeStyle = isComplete
				? "background:#16a34a;color:#fff"
				: "background:#ea580c;color:#fff";
			const badgeLabel = isComplete ? "Complete" : "In Progress";

			return `
				<div style="border:1px solid;border-radius:12px;padding:20px;${bg}">
					<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:16px">
						<div style="font-family:'Recoleta',Georgia,serif;font-size:18px;font-weight:700;color:#1b1411">${s.title}</div>
						<span style="display:inline-block;padding:4px 10px;border-radius:9999px;font-size:11px;font-weight:600;white-space:nowrap;${badgeStyle}">${badgeLabel}</span>
					</div>
					${s.description ? `<p style="margin-top:8px;font-size:13px;line-height:1.6;color:rgba(27,20,17,0.7)">${s.description}</p>` : ""}
				</div>`;
		})
		.join("");

	return `
		<div style="padding:40px;font-family:'Inter',system-ui,sans-serif;max-width:800px">
			<div style="text-align:center">
				<div style="font-size:48px">🎉</div>
				<h1 style="margin-top:12px;font-family:'Recoleta',Georgia,serif;font-size:32px;font-weight:700;color:#1b1411">Profile Complete!</h1>
				<p style="margin-top:8px;font-size:15px;color:rgba(27,20,17,0.6)">${studentName}'s Genius Summary</p>
			</div>
			<div style="margin-top:32px;display:flex;flex-direction:column;gap:16px">
				${sectionCards}
			</div>
		</div>`;
}

/**
 * Render a profile summary off-screen, capture it, and download as PDF.
 */
export async function downloadProfilePdf(
	studentName: string,
	sections: ProfileSectionData[],
): Promise<void> {
	const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
		import("html2canvas-pro"),
		import("jspdf"),
	]);

	// Create a temporary off-screen container
	const container = document.createElement("div");
	container.style.position = "fixed";
	container.style.left = "-9999px";
	container.style.top = "0";
	container.style.width = "800px";
	container.style.background = "#fff";
	container.innerHTML = buildProfileHtml(studentName, sections);
	document.body.appendChild(container);

	try {
		const canvas = await html2canvas(container, {
			scale: 2,
			useCORS: true,
			backgroundColor: "#ffffff",
		});

		const imgWidth = 210; // A4 mm
		const imgHeight = (canvas.height * imgWidth) / canvas.width;
		const pdf = new jsPDF("p", "mm", "a4");
		const pageHeight = 297;

		if (imgHeight > pageHeight) {
			const scaledWidth = (canvas.width * pageHeight) / canvas.height;
			const xOffset = (imgWidth - scaledWidth) / 2;
			pdf.addImage(
				canvas.toDataURL("image/png"),
				"PNG",
				xOffset,
				0,
				scaledWidth,
				pageHeight,
			);
		} else {
			pdf.addImage(
				canvas.toDataURL("image/png"),
				"PNG",
				0,
				0,
				imgWidth,
				imgHeight,
			);
		}

		const safeName = studentName.replace(/[^a-zA-Z0-9]/g, "_");
		const date = new Date().toISOString().split("T")[0];
		pdf.save(`MyGeniusProfile_${safeName}_${date}.pdf`);
	} finally {
		document.body.removeChild(container);
	}
}
