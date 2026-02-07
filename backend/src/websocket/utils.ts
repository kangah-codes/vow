import { WebSocket } from "ws";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

/** Send a typed JSON event over WebSocket */
export function sendEvent(
	ws: WebSocket,
	type: string,
	payload?: Record<string, unknown>,
): void {
	ws.send(JSON.stringify(payload ? { type, payload } : { type }));
}

/** Send an error event and optionally close the connection */
export function sendError(
	ws: WebSocket,
	message: string,
	close = false,
): void {
	sendEvent(ws, "error", { message });
	if (close) ws.close();
}

/** Verify a JWT and return the userId, or null if invalid */
export function verifyToken(token: string): string | null {
	try {
		const payload = jwt.verify(token, env.JWT_SECRET) as { userId: string };
		return payload.userId;
	} catch {
		return null;
	}
}

/**
 * Progressively extract a JSON string field from a partial JSON stream.
 * Returns the extracted text so far, or null if the key hasn't appeared yet.
 */
export function extractJsonStringField(
	partial: string,
	key: string,
): string | null {
	const keyPattern = `"${key}"`;
	const keyStart = partial.indexOf(keyPattern);
	if (keyStart === -1) return null;

	// Find the opening quote of the value
	const colonIndex = partial.indexOf(":", keyStart + keyPattern.length);
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

export function extractMessageField(partial: string): string | null {
	return extractJsonStringField(partial, "message");
}

export function extractSectionContentField(partial: string): string | null {
	return extractJsonStringField(partial, "sectionContent");
}
