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

export async function apiFetch<T>(
	path: string,
	options?: RequestInit
): Promise<T> {
	const res = await fetch(`${API_BASE_URL}${path}`, {
		...options,
		headers: {
			"Content-Type": "application/json",
			...options?.headers,
		},
	});

	const data = await res.json();

	if (!res.ok) {
		throw new ApiError(res.status, data.error || "Something went wrong");
	}

	return data;
}
