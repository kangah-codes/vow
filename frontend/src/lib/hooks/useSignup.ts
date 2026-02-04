import { useMutation } from "@tanstack/react-query";
import { apiFetch, ApiError } from "@/lib/api";

interface SignupRequest {
	email: string;
	password: string;
	firstName: string;
	lastName: string;
	role: string;
	agreedToTerms: boolean;
	focusGroupOptIn: boolean;
}

interface SignupResponse {
	success: boolean;
	data: {
		user: {
			id: string;
			email: string;
			firstName: string;
			lastName: string;
			role: string;
			focusGroupOptIn: boolean;
		};
		accessToken: string;
		refreshToken: string;
	};
}

export function useSignup() {
	return useMutation<SignupResponse, ApiError, SignupRequest>({
		mutationFn: (data) =>
			apiFetch<SignupResponse>("/auth/signup", {
				method: "POST",
				body: JSON.stringify(data),
			}),
	});
}
