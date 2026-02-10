import { useMutation } from "@tanstack/react-query";
import { apiFetch, ApiError } from "@/lib/utils/api";
import { clearAuthCookies } from "@/lib/utils/cookies";

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
	return useMutation<LogoutResponse, ApiError, void>({
		mutationFn: async () => {
			const refreshToken = getRefreshToken();
			clearAuthCookies();

			apiFetch<LogoutResponse>("/auth/logout", {
				method: "POST",
				body: JSON.stringify({ refreshToken }),
				skipAuthRedirect: true,
			});

			window.location.href = "/login";
			return new Promise<never>(() => {});
		},
	});
}
