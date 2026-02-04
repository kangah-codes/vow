import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { apiFetch, ApiError } from "@/lib/api";
import { clearAuthCookies } from "@/lib/cookies";

interface LogoutResponse {
	success: boolean;
	message: string;
}

function getRefreshToken(): string | undefined {
	if (typeof document === "undefined") return undefined;
	const match = document.cookie.match(/(?:^|; )refreshToken=([^;]*)/);
	return match?.[1];
}

export function useLogout() {
	const queryClient = useQueryClient();
	const router = useRouter();

	return useMutation<LogoutResponse, ApiError, void>({
		mutationFn: async () => {
			const refreshToken = getRefreshToken();
			return apiFetch<LogoutResponse>("/auth/logout", {
				method: "POST",
				body: JSON.stringify({ refreshToken }),
			});
		},
		onSuccess: () => {
			clearAuthCookies();
			queryClient.clear();
			router.push("/login");
		},
		onError: () => {
			// Even if the API call fails, clear local state
			clearAuthCookies();
			queryClient.clear();
			router.push("/login");
		},
	});
}
