const API_BASE_URL = "http://localhost:3001/api";

export class ApiError extends Error {
	constructor(
		public status: number,
		message: string
	) {
		super(message);
		this.name = "ApiError";
	}
}

function getAccessToken(): string | undefined {
	if (typeof document === "undefined") return undefined;
	const match = document.cookie.match(/(?:^|; )accessToken=([^;]*)/);
	return match?.[1];
}

export async function apiFetch<T>(
	path: string,
	options?: RequestInit
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
		if (res.status === 401 && typeof window !== "undefined") {
			document.cookie = "accessToken=; path=/; max-age=0";
			document.cookie = "refreshToken=; path=/; max-age=0";
			window.location.href = "/session-expired";
			return new Promise<never>(() => {});
		}
		throw new ApiError(res.status, data.error || "Something went wrong");
	}

	return data;
}
