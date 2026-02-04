import { useMutation } from "@tanstack/react-query";
import { apiFetch, ApiError } from "@/lib/api";

interface CreateProfileInput {
	studentName: string;
	gradeLevel: string;
	age?: number;
	school?: string;
	relationship: string;
}

interface CreateProfileResponse {
	success: boolean;
	data: {
		profile: {
			id: string;
			studentName: string;
			accessCode: string;
			status: string;
		};
		conversationId: string;
	};
}

export function useCreateProfile() {
	return useMutation<CreateProfileResponse, ApiError, CreateProfileInput>({
		mutationFn: (input) =>
			apiFetch<CreateProfileResponse>("/profiles", {
				method: "POST",
				body: JSON.stringify(input),
			}),
	});
}
