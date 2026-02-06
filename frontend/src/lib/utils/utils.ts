import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function formatTime(ts: string | Date): string {
	const d = new Date(ts);
	return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}
