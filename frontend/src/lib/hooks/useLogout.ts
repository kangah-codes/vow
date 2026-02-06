import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { apiFetch, ApiError, setLoggingOut } from "@/lib/utils/api";
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

function handleLogoutCleanup(
	queryClient: ReturnType<typeof useQueryClient>,
	router: ReturnType<typeof useRouter>,
) {
	clearAuthCookies();
	queryClient.clear();
	router.push("/login");
}

export function useLogout() {
	const queryClient = useQueryClient();
	const router = useRouter();

	return useMutation<LogoutResponse, ApiError, void>({
		mutationFn: async () => {
			setLoggingOut(true);
			const refreshToken = getRefreshToken();
			return apiFetch<LogoutResponse>("/auth/logout", {
				method: "POST",
				body: JSON.stringify({ refreshToken }),
			});
		},
		onSuccess: () => {
			handleLogoutCleanup(queryClient, router);
		},
		onError: () => {
			handleLogoutCleanup(queryClient, router);
		},
	});
}
