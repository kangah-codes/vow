import { WebSocket } from "ws";
import { IncomingMessage } from "http";
import { logger } from "../utils/logger";
import { sendEvent, sendError } from "./utils";
import { handleJoin } from "./handlers/join";
import { handleSendMessage } from "./handlers/sendMessage";

interface ChatMessage {
	type: "join" | "send_message" | "ping";
	payload: {
		conversationId?: string;
		message?: string;
		token?: string;
	};
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
					sendEvent(ws, "pong");
					break;
				}

				case "join": {
					const result = await handleJoin(ws, message.payload);
					if (result) {
						userId = result.userId;
						conversationId = result.conversationId;
					}
					break;
				}

				case "send_message": {
					if (!userId || !conversationId) {
						sendError(ws, "Not joined to a conversation");
						return;
					}
					const userMessage = message.payload.message;
					if (!userMessage || !userMessage.trim()) return;

					await handleSendMessage(
						ws,
						userId,
						conversationId,
						userMessage,
					);
					break;
				}

				default:
					logger.warn("Unknown WebSocket message type:", message.type);
			}
		} catch {
			logger.error("Failed to parse WebSocket message");
			sendError(ws, "Invalid message format");
		}
	});

	ws.on("close", () => {
		logger.info(`WebSocket connection closed for user ${userId || "unknown"}`);
	});

	ws.on("error", (error) => {
		logger.error("WebSocket error:", error);
	});
}
