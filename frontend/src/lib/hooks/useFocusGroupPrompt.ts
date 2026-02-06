import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch, ApiError } from "@/lib/utils/api";

interface FocusGroupResponse {
	success: boolean;
	data: {
		focusGroupOptIn: boolean;
		focusGroupPrompted: boolean;
	};
}

export function useFocusGroupPrompt() {
	const queryClient = useQueryClient();

	return useMutation<FocusGroupResponse, ApiError, boolean>({
		mutationFn: async (optIn: boolean) => {
			return apiFetch<FocusGroupResponse>("/auth/focus-group", {
				method: "POST",
				body: JSON.stringify({ optIn }),
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["currentUser"] });
		},
	});
}
