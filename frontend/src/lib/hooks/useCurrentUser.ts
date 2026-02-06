import { useQuery } from "@tanstack/react-query";
import { apiFetch, ApiError } from "@/lib/utils/api";

export interface CurrentUser {
	id: string;
	email: string;
	firstName: string;
	lastName: string;
	role: string;
	focusGroupOptIn: boolean;
	focusGroupPrompted: boolean;
}

interface MeResponse {
	success: boolean;
	data: CurrentUser;
}

export function useCurrentUser() {
	return useQuery<CurrentUser, ApiError>({
		queryKey: ["currentUser"],
		queryFn: async () => {
			const res = await apiFetch<MeResponse>("/auth/me");
			return res.data;
		},
	});
}
