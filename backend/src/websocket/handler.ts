import { WebSocket } from "ws";
import { IncomingMessage } from "http";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { Conversation } from "../models/conversation.model";
import { logger } from "../utils/logger";

interface ChatMessage {
	type: "join" | "send_message" | "ping";
	payload: {
		conversationId?: string;
		message?: string;
		token?: string;
	};
}

const MOCK_RESPONSES = [
	"That's a really insightful observation. Can you tell me more about how that shows up in their daily life?",
	"I love hearing that! It sounds like they have a strong sense of curiosity. How do they react when encountering something new or unfamiliar?",
	"That's wonderful. Understanding these qualities helps us build a complete picture. What about in social situations — how do they interact with peers from different backgrounds?",
	"Thank you for sharing that. It tells me a lot about their character. Can you think of a specific moment that really demonstrated this quality?",
	"That's a great example. Let's explore another dimension — how does the student handle challenges or setbacks? Do they tend to persevere or need encouragement?",
	"Interesting! Resilience is such an important trait. Now, thinking about trust — are there particular adults or mentors outside the family that the student looks up to?",
	"I appreciate you sharing all of this. It's helping me understand the student on a deeper level. Let's talk about fairness — has the student ever spoken up about something they felt was unfair?",
];

function getRandomDelay(): number {
	return Math.floor(Math.random() * 2000) + 4000;
}

function getRandomResponse(): string {
	return MOCK_RESPONSES[Math.floor(Math.random() * MOCK_RESPONSES.length)];
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

					const delay = getRandomDelay();
					ws.send(JSON.stringify({ type: "ai_typing" }));

					setTimeout(async () => {
						if (ws.readyState !== WebSocket.OPEN) return;

						const fullResponse = getRandomResponse();
						const words = fullResponse.split(" ");

						ws.send(JSON.stringify({ type: "ai_stream_start" }));

						let streamed = "";
						for (let i = 0; i < words.length; i++) {
							if (ws.readyState !== WebSocket.OPEN) return;

							streamed += (i > 0 ? " " : "") + words[i];
							ws.send(
								JSON.stringify({
									type: "ai_stream_chunk",
									payload: { word: words[i], full: streamed },
								}),
							);

							await new Promise((r) =>
								setTimeout(r, Math.floor(Math.random() * 50) + 30),
							);
						}

						const conv = await Conversation.findById(conversationId);
						if (!conv) return;

						const aiMsg = {
							sender: "ai" as const,
							senderName: "Genius Guide",
							message: fullResponse,
							timestamp: new Date(),
						};
						conv.messages.push(aiMsg);
						await conv.save();

						const savedAiMsg = conv.messages[conv.messages.length - 1];

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
					}, delay);

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
