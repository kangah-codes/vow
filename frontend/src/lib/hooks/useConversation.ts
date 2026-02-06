import { useQuery } from "@tanstack/react-query";
import { apiFetch, ApiError } from "@/lib/utils/api";

interface Message {
	_id: string;
	sender: "ai" | "user";
	senderName: string;
	message: string;
	timestamp: string;
}

interface ProfileSummary {
	_id: string;
	studentName: string;
	gradeLevel: string;
	percentComplete: number;
	status: "in-progress" | "complete";
	sections: {
		title: string;
		status: "not-started" | "in-progress" | "complete";
		description?: string;
	}[];
	accessCode: string;
}

interface ConversationData {
	_id: string;
	profileId: string;
	userId: string;
	messages: Message[];
	currentSection?: string;
	createdAt: string;
	updatedAt: string;
}

export interface ConversationResponse {
	success: boolean;
	data: {
		conversation: ConversationData;
		profile: ProfileSummary;
	};
}

export function useConversation(id: string) {
	return useQuery<ConversationResponse["data"], ApiError>({
		queryKey: ["conversation", id],
		queryFn: async () => {
			const res = await apiFetch<ConversationResponse>(`/conversations/${id}`);
			return res.data;
		},
		enabled: !!id,
	});
}
