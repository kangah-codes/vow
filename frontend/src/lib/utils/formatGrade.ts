export function formatGrade(gradeLevel: string): string {
	if (gradeLevel === "pre-k") return "Pre-K";
	if (gradeLevel === "k") return "Kindergarten";
	return `Grade ${gradeLevel}`;
}
