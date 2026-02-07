import { WebSocket } from "ws";
import { Conversation } from "../../models/conversation.model";
import { Profile } from "../../models/profile.model";
import { logger } from "../../utils/logger";
import {
	streamAIResponse,
	parseAIResponse,
	updateProfileProgress,
	getNextSection,
	type AIResponse,
} from "../../services/conversation.service";
import {
	sendEvent,
	sendError,
	extractMessageField,
	extractSectionContentField,
} from "../utils";

/**
 * Stream AI chunks to the client, extracting message and sectionContent
 * fields progressively. Returns the full raw response string.
 */
async function streamAndSendChunks(
	ws: WebSocket,
	stream: AsyncIterable<string>,
	getFullResponse: () => string,
	activeSection: string,
): Promise<{ anyChunksSent: boolean }> {
	let streamedMessage = "";
	let anyChunksSent = false;

	for await (const chunk of stream) {
		if (ws.readyState !== WebSocket.OPEN) return { anyChunksSent };
		streamedMessage += chunk;

		const displayText = extractMessageField(streamedMessage);
		if (displayText) {
			anyChunksSent = true;
			sendEvent(ws, "ai_stream_chunk", { chunk, full: displayText });
		}

		const sectionContent = extractSectionContentField(streamedMessage);
		if (sectionContent) {
			sendEvent(ws, "section_content_chunk", {
				sectionTitle: activeSection,
				content: sectionContent,
			});
		}
	}

	if (ws.readyState !== WebSocket.OPEN) return { anyChunksSent };

	// Fallback: if progressive extraction never found content, send the full parsed message
	if (!anyChunksSent) {
		const fallbackResponse = parseAIResponse(getFullResponse());
		if (fallbackResponse.message && ws.readyState === WebSocket.OPEN) {
			sendEvent(ws, "ai_stream_chunk", {
				chunk: fallbackResponse.message,
				full: fallbackResponse.message,
			});
			await new Promise((resolve) => setTimeout(resolve, 80));
		}
	}

	return { anyChunksSent };
}

/**
 * Save the AI message to the conversation and advance the section if complete.
 * Returns the saved AI message document (with _id).
 */
async function saveAiResponse(
	conversationId: string,
	aiResponse: AIResponse,
	activeSection: string,
) {
	let nextSection: string | null = null;
	if (aiResponse.sectionComplete) {
		nextSection = getNextSection(activeSection);
		logger.info(
			`[SECTION DEBUG] section "${activeSection}" marked complete, advancing to: "${nextSection}"`,
		);
	}

	await Conversation.findByIdAndUpdate(conversationId, {
		$push: {
			messages: {
				sender: "ai",
				senderName: "Genius Guide",
				message: aiResponse.message,
				timestamp: new Date(),
			},
		},
		...(nextSection ? { $set: { currentSection: nextSection } } : {}),
	});

	// Re-fetch to get the saved message with its _id
	const updatedConv = await Conversation.findById(conversationId);
	if (!updatedConv) return null;

	const savedAiMsg = updatedConv.messages[updatedConv.messages.length - 1];
	return { savedAiMsg, nextSection };
}

/**
 * Update profile progress and notify the client that a section is complete.
 */
async function handleSectionComplete(
	ws: WebSocket,
	profileId: string,
	activeSection: string,
	aiResponse: AIResponse,
	nextSection: string | null,
): Promise<void> {
	const updatedProfile = await updateProfileProgress(
		profileId,
		activeSection,
		aiResponse,
	);

	if (updatedProfile) {
		sendEvent(ws, "section_complete", {
			sections: updatedProfile.sections,
			percentComplete: updatedProfile.percentComplete,
			status: updatedProfile.status,
			currentSection: nextSection || activeSection,
		});
	}
}

/**
 * Handle a "send_message" event: save the user message, stream the AI response,
 * save the AI message, and update profile progress if a section completes.
 */
export async function handleSendMessage(
	ws: WebSocket,
	userId: string,
	conversationId: string,
	userMessage: string,
): Promise<void> {
	const trimmed = userMessage.trim();
	if (!trimmed) return;

	const conversation = await Conversation.findById(conversationId);
	if (!conversation) return;

	const profile = await Profile.findById(conversation.profileId);
	if (!profile) return;

	if (profile.status === "complete") {
		sendError(
			ws,
			"This profile is already complete. No further messages can be sent.",
		);
		return;
	}

	// Capture current section ONCE before any mutations
	const activeSection = conversation.currentSection || "Interest Awareness";

	logger.info(
		`[SECTION DEBUG] conversation.currentSection from DB: "${conversation.currentSection}"`,
	);
	logger.info(
		`[SECTION DEBUG] activeSection resolved to: "${activeSection}"`,
	);
	logger.info(
		`[SECTION DEBUG] profile sections: ${JSON.stringify(profile.sections.map((s) => ({ title: s.title, status: s.status })))}`,
	);

	// Mark section as in-progress if it's not started yet
	const sectionData = profile.sections.find(
		(s) => s.title === activeSection,
	);
	if (sectionData && sectionData.status === "not-started") {
		logger.info(
			`[SECTION DEBUG] marking "${activeSection}" as in-progress (was not-started)`,
		);
		sectionData.status = "in-progress";
		await profile.save();
	}

	// Save user message
	conversation.messages.push({
		sender: "user" as const,
		senderName: "You",
		message: trimmed,
		timestamp: new Date(),
	});
	await conversation.save();

	const savedMsg = conversation.messages[conversation.messages.length - 1];
	sendEvent(ws, "message_saved", {
		id: savedMsg._id,
		sender: savedMsg.sender,
		senderName: savedMsg.senderName,
		message: savedMsg.message,
		timestamp: savedMsg.timestamp,
	});

	// Start AI response
	sendEvent(ws, "ai_typing");

	try {
		const { stream, getFullResponse } = await streamAIResponse(
			profile,
			conversation,
			trimmed,
		);

		sendEvent(ws, "ai_stream_start");

		await streamAndSendChunks(ws, stream, getFullResponse, activeSection);

		if (ws.readyState !== WebSocket.OPEN) return;

		// Parse the complete response
		const fullResponse = getFullResponse();
		logger.info(
			`[SECTION DEBUG] raw AI response (first 300 chars): ${fullResponse.substring(0, 300)}`,
		);

		const aiResponse = parseAIResponse(fullResponse);
		logger.info(
			`[SECTION DEBUG] parsed AI response: sectionComplete=${aiResponse.sectionComplete}, sectionContent=${aiResponse.sectionContent ? aiResponse.sectionContent.substring(0, 100) + "..." : "null"}`,
		);

		// Save AI message and advance section
		const result = await saveAiResponse(
			conversationId,
			aiResponse,
			activeSection,
		);
		if (!result) return;

		const { savedAiMsg, nextSection } = result;

		sendEvent(ws, "ai_stream_end", {
			id: savedAiMsg._id,
			sender: savedAiMsg.sender,
			senderName: savedAiMsg.senderName,
			message: savedAiMsg.message,
			timestamp: savedAiMsg.timestamp,
		});

		// Update profile progress if section completed
		if (aiResponse.sectionComplete) {
			await handleSectionComplete(
				ws,
				profile._id.toString(),
				activeSection,
				aiResponse,
				nextSection,
			);
		}
	} catch (aiError) {
		logger.error("AI response error:", aiError);
		sendError(
			ws,
			"I'm having trouble responding right now. Please try again.",
		);
	}
}
