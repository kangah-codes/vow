import { useQuery } from "@tanstack/react-query";
import { apiFetch, ApiError } from "@/lib/api";

export interface ProfileSection {
	title: string;
	status: "not-started" | "in-progress" | "complete";
	description?: string;
}

export interface Profile {
	_id: string;
	userId: string;
	studentName: string;
	gradeLevel: string;
	age?: number;
	school?: string;
	relationship: string;
	accessCode: string;
	accessCodeExpiresAt: string;
	percentComplete: number;
	status: "in-progress" | "complete";
	sections: ProfileSection[];
	teacherEmail?: string;
	createdAt: string;
	updatedAt: string;
}

interface ProfilesResponse {
	success: boolean;
	data: Profile[];
}

export function useProfiles() {
	return useQuery<Profile[], ApiError>({
		queryKey: ["profiles"],
		queryFn: async () => {
			const res = await apiFetch<ProfilesResponse>("/profiles");
			return res.data;
		},
	});
}
