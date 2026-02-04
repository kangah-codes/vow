import { useMutation } from "@tanstack/react-query";
import { apiFetch, ApiError } from "@/lib/api";

interface LoginRequest {
	email: string;
	password: string;
}

interface LoginResponse {
	success: boolean;
	data: {
		user: {
			id: string;
			email: string;
			firstName: string;
			lastName: string;
			role: string;
		};
		accessToken: string;
		refreshToken: string;
	};
}

export function useLogin() {
	return useMutation<LoginResponse, ApiError, LoginRequest>({
		mutationFn: (data) =>
			apiFetch<LoginResponse>("/auth/login", {
				method: "POST",
				body: JSON.stringify(data),
			}),
	});
}
