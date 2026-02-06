import { getAccessToken } from "@/lib/cookies";

const API_BASE_URL = "http://localhost:3001/api";

export class ApiError extends Error {
	constructor(
		public status: number,
		message: string,
	) {
		super(message);
		this.name = "ApiError";
	}
}

let isLoggingOut = false;

export function setLoggingOut(value: boolean) {
	isLoggingOut = value;
}

export async function apiFetch<T>(
	path: string,
	options?: RequestInit,
): Promise<T> {
	const token = getAccessToken();
	const res = await fetch(`${API_BASE_URL}${path}`, {
		...options,
		headers: {
			"Content-Type": "application/json",
			...(token ? { Authorization: `Bearer ${token}` } : {}),
			...options?.headers,
		},
	});

	const data = await res.json();

	if (!res.ok) {
		if (res.status === 401 && typeof window !== "undefined" && !isLoggingOut) {
			document.cookie = "accessToken=; path=/; max-age=0";
			document.cookie = "refreshToken=; path=/; max-age=0";

			const protectedRoutes = [
				"/dashboard",
				"/conversation",
				"/profile",
				"/start",
			];
			const currentPath = window.location.pathname;
			const isProtectedRoute = protectedRoutes.some(
				(route) => currentPath === route || currentPath.startsWith(`${route}/`),
			);

			if (isProtectedRoute) {
				window.location.href = "/session-expired";
				return new Promise<never>(() => {});
			}
		}
		throw new ApiError(res.status, data.error || "Something went wrong");
	}

	return data;
}
