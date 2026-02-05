import { WebSocket } from "ws";
import { IncomingMessage } from "http";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { Conversation } from "../models/conversation.model";
import { Profile } from "../models/profile.model";
import { logger } from "../utils/logger";
import {
	streamAIResponse,
	parseAIResponse,
	updateProfileProgress,
	getNextSection,
} from "../services/conversation.service";

interface ChatMessage {
	type: "join" | "send_message" | "ping";
	payload: {
		conversationId?: string;
		message?: string;
		token?: string;
	};
}

function verifyToken(token: string): string | null {
	try {
		const payload = jwt.verify(token, env.JWT_SECRET) as { userId: string };
		return payload.userId;
	} catch {
		return null;
	}
}

export function handleWebSocketConnection(
	ws: WebSocket,
	_req: IncomingMessage,
): void {
	logger.info("New WebSocket connection established");

	let userId: string | null = null;
	let conversationId: string | null = null;

	ws.on("message", async (data) => {
		try {
			const message: ChatMessage = JSON.parse(data.toString());

			switch (message.type) {
				case "ping": {
					ws.send(JSON.stringify({ type: "pong" }));
					break;
				}

				case "join": {
					const token = message.payload.token;
					if (!token) {
						ws.send(
							JSON.stringify({
								type: "error",
								payload: {
									message: "You must be signed in to perform this action",
								},
							}),
						);
						ws.close();
						return;
					}

					userId = verifyToken(token);
					if (!userId) {
						ws.send(
							JSON.stringify({
								type: "error",
								payload: { message: "Invalid token" },
							}),
						);
						ws.close();
						return;
					}

					conversationId = message.payload.conversationId || null;
					if (!conversationId) {
						ws.send(
							JSON.stringify({
								type: "error",
								payload: { message: "Conversation ID required" },
							}),
						);
						ws.close();
						return;
					}

					const conversation = await Conversation.findOne({
						_id: conversationId,
						userId,
					});

					if (!conversation) {
						ws.send(
							JSON.stringify({
								type: "error",
								payload: { message: "Conversation not found" },
							}),
						);
						ws.close();
						return;
					}

					ws.send(
						JSON.stringify({
							type: "joined",
							payload: { conversationId },
						}),
					);

					logger.info(`User ${userId} joined conversation ${conversationId}`);
					break;
				}

				case "send_message": {
					if (!userId || !conversationId) {
						ws.send(
							JSON.stringify({
								type: "error",
								payload: { message: "Not joined to a conversation" },
							}),
						);
						return;
					}

					const userMessage = message.payload.message;
					if (!userMessage || !userMessage.trim()) return;

					const conversation = await Conversation.findById(conversationId);
					if (!conversation) return;

					const profile = await Profile.findById(conversation.profileId);
					if (!profile) return;

					if (profile.status === "complete") {
						ws.send(
							JSON.stringify({
								type: "error",
								payload: {
									message:
										"This profile is already complete. No further messages can be sent.",
								},
							}),
						);
						return;
					}

					// Capture current section ONCE before any mutations
					const activeSection =
						conversation.currentSection || "Interest Awareness";

					logger.info(`[SECTION DEBUG] conversation.currentSection from DB: "${conversation.currentSection}"`);
					logger.info(`[SECTION DEBUG] activeSection resolved to: "${activeSection}"`);
					logger.info(`[SECTION DEBUG] profile sections: ${JSON.stringify(profile.sections.map(s => ({ title: s.title, status: s.status })))}`);

					// Mark section as in-progress if it's not started yet
					const sectionData = profile.sections.find(
						(s) => s.title === activeSection,
					);
					if (sectionData && sectionData.status === "not-started") {
						logger.info(`[SECTION DEBUG] marking "${activeSection}" as in-progress (was not-started)`);
						sectionData.status = "in-progress";
						await profile.save();
					}

					// Save user message (only push to messages, don't re-save currentSection)
					const userMsg = {
						sender: "user" as const,
						senderName: "You",
						message: userMessage.trim(),
						timestamp: new Date(),
					};

					conversation.messages.push(userMsg);
					await conversation.save();

					const savedMsg =
						conversation.messages[conversation.messages.length - 1];
					ws.send(
						JSON.stringify({
							type: "message_saved",
							payload: {
								id: savedMsg._id,
								sender: savedMsg.sender,
								senderName: savedMsg.senderName,
								message: savedMsg.message,
								timestamp: savedMsg.timestamp,
							},
						}),
					);

					// Start AI response
					ws.send(JSON.stringify({ type: "ai_typing" }));

					try {
						const { stream, getFullResponse } = await streamAIResponse(
							profile,
							conversation,
							userMessage.trim(),
						);

						ws.send(JSON.stringify({ type: "ai_stream_start" }));

						// Stream chunks to client
						let streamedMessage = "";
						let anyChunksSent = false;
						for await (const chunk of stream) {
							if (ws.readyState !== WebSocket.OPEN) return;
							streamedMessage += chunk;

							// Try to extract the message field progressively for display
							const displayText = extractMessageField(streamedMessage);
							if (displayText) {
								anyChunksSent = true;
								ws.send(
									JSON.stringify({
										type: "ai_stream_chunk",
										payload: { chunk, full: displayText },
									}),
								);
							}
						}

						if (ws.readyState !== WebSocket.OPEN) return;

						// If no chunks were sent (extractMessageField never found content),
						// send the parsed message as a single chunk so the client sees it
						if (!anyChunksSent) {
							const fallbackResponse = parseAIResponse(getFullResponse());
							if (fallbackResponse.message && ws.readyState === WebSocket.OPEN) {
								ws.send(
									JSON.stringify({
										type: "ai_stream_chunk",
										payload: { chunk: fallbackResponse.message, full: fallbackResponse.message },
									}),
								);
								// Small delay to ensure the client can render the chunk before stream_end
								await new Promise((resolve) => setTimeout(resolve, 80));
							}
						}

						// Parse the complete response
						const fullResponse = getFullResponse();
						logger.info(`[SECTION DEBUG] raw AI response (first 300 chars): ${fullResponse.substring(0, 300)}`);

						const aiResponse = parseAIResponse(fullResponse);
						logger.info(`[SECTION DEBUG] parsed AI response: sectionComplete=${aiResponse.sectionComplete}, sectionContent=${aiResponse.sectionContent ? aiResponse.sectionContent.substring(0, 100) + "..." : "null"}`);

						// Save AI message and advance section atomically
						let nextSection: string | null = null;
						if (aiResponse.sectionComplete) {
							nextSection = getNextSection(activeSection);
							logger.info(`[SECTION DEBUG] section "${activeSection}" marked complete, advancing to: "${nextSection}"`);
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
							...(nextSection
								? { $set: { currentSection: nextSection } }
								: {}),
						});

						// Re-fetch to get the saved message with its _id
						const updatedConv =
							await Conversation.findById(conversationId);
						if (!updatedConv) return;

						const savedAiMsg =
							updatedConv.messages[updatedConv.messages.length - 1];

						ws.send(
							JSON.stringify({
								type: "ai_stream_end",
								payload: {
									id: savedAiMsg._id,
									sender: savedAiMsg.sender,
									senderName: savedAiMsg.senderName,
									message: savedAiMsg.message,
									timestamp: savedAiMsg.timestamp,
								},
							}),
						);

						// Update profile progress using the captured activeSection
						if (aiResponse.sectionComplete) {
							const updatedProfile = await updateProfileProgress(
								profile._id.toString(),
								activeSection,
								aiResponse,
							);

							if (updatedProfile) {
								ws.send(
									JSON.stringify({
										type: "section_complete",
										payload: {
											sections: updatedProfile.sections,
											percentComplete: updatedProfile.percentComplete,
											status: updatedProfile.status,
											currentSection:
												nextSection || activeSection,
										},
									}),
								);
							}
						}
					} catch (aiError) {
						logger.error("AI response error:", aiError);
						ws.send(
							JSON.stringify({
								type: "error",
								payload: {
									message:
										"I'm having trouble responding right now. Please try again.",
								},
							}),
						);
					}

					break;
				}

				default:
					logger.warn("Unknown WebSocket message type:", message.type);
			}
		} catch {
			logger.error("Failed to parse WebSocket message");
			ws.send(
				JSON.stringify({
					type: "error",
					payload: { message: "Invalid message format" },
				}),
			);
		}
	});

	ws.on("close", () => {
		logger.info(`WebSocket connection closed for user ${userId || "unknown"}`);
	});

	ws.on("error", (error) => {
		logger.error("WebSocket error:", error);
	});
}

/**
 * Progressively extract the "message" field from a partial JSON stream.
 * Returns the extracted text so far, or null if we can't parse yet.
 */
function extractMessageField(partial: string): string | null {
	// Look for "message": " pattern and extract content after it
	const messageStart = partial.indexOf('"message"');
	if (messageStart === -1) return null;

	// Find the opening quote of the value
	const colonIndex = partial.indexOf(":", messageStart + 9);
	if (colonIndex === -1) return null;

	// Find the start of the string value
	const valueStart = partial.indexOf('"', colonIndex + 1);
	if (valueStart === -1) return null;

	// Extract everything after the opening quote, handling escape sequences
	let result = "";
	let i = valueStart + 1;
	while (i < partial.length) {
		if (partial[i] === "\\") {
			if (i + 1 < partial.length) {
				const next = partial[i + 1];
				if (next === '"') result += '"';
				else if (next === "n") result += "\n";
				else if (next === "\\") result += "\\";
				else if (next === "t") result += "\t";
				else result += next;
				i += 2;
				continue;
			}
			break;
		}
		if (partial[i] === '"') {
			// End of string value
			break;
		}
		result += partial[i];
		i++;
	}

	return result || null;
}
