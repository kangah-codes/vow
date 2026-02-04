import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch, ApiError } from "@/lib/api";

interface DeleteProfileResponse {
	success: boolean;
	message: string;
}

export function useDeleteProfile() {
	const queryClient = useQueryClient();

	return useMutation<DeleteProfileResponse, ApiError, string>({
		mutationFn: async (profileId: string) => {
			return apiFetch<DeleteProfileResponse>(`/profiles/${profileId}`, {
				method: "DELETE",
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["profiles"] });
		},
	});
}
