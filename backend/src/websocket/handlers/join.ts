import { WebSocket } from "ws";
import { Conversation } from "../../models/conversation.model";
import { logger } from "../../utils/logger";
import { verifyToken, sendEvent, sendError } from "../utils";

interface JoinPayload {
	token?: string;
	conversationId?: string;
}

interface JoinResult {
	userId: string;
	conversationId: string;
}

/**
 * Handle a "join" message: verify auth, validate conversation ownership,
 * and return session info on success.
 */
export async function handleJoin(
	ws: WebSocket,
	payload: JoinPayload,
): Promise<JoinResult | null> {
	const { token, conversationId } = payload;

	if (!token) {
		sendError(ws, "You must be signed in to perform this action", true);
		return null;
	}

	const userId = verifyToken(token);
	if (!userId) {
		sendError(ws, "Invalid token", true);
		return null;
	}

	if (!conversationId) {
		sendError(ws, "Conversation ID required", true);
		return null;
	}

	const conversation = await Conversation.findOne({
		_id: conversationId,
		userId,
	});

	if (!conversation) {
		sendError(ws, "Conversation not found", true);
		return null;
	}

	sendEvent(ws, "joined", { conversationId });
	logger.info(`User ${userId} joined conversation ${conversationId}`);

	return { userId, conversationId };
}
