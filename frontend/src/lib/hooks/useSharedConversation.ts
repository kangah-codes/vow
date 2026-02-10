import { useQuery } from "@tanstack/react-query";
import { ApiError, API_BASE_URL } from "@/lib/utils/api";
import type { ConversationResponse } from "./useConversation";

export function useSharedConversation(accessCode: string) {
	return useQuery<ConversationResponse["data"], ApiError>({
		queryKey: ["shared-conversation", accessCode],
		queryFn: async () => {
			const res = await fetch(`${API_BASE_URL}/shared/${accessCode}`);
			const data = await res.json();
			if (!res.ok) {
				throw new ApiError(res.status, data.error || "Something went wrong");
			}
			return data.data;
		},
		enabled: !!accessCode,
		retry: false,
	});
}
