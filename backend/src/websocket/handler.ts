import { WebSocket } from "ws";
import { IncomingMessage } from "http";
import { WebSocketMessage } from "../types";
import { logger } from "../utils/logger";

export function handleWebSocketConnection(ws: WebSocket, _req: IncomingMessage): void {
  logger.info("New WebSocket connection established");

  ws.on("message", (data) => {
    try {
      const message: WebSocketMessage = JSON.parse(data.toString());
      logger.debug("WebSocket message received:", message.type);

      // Handle messages based on type
      switch (message.type) {
        case "ping":
          ws.send(JSON.stringify({ type: "pong", payload: null }));
          break;
        default:
          logger.warn("Unknown WebSocket message type:", message.type);
      }
    } catch {
      logger.error("Failed to parse WebSocket message");
      ws.send(JSON.stringify({ type: "error", payload: "Invalid message format" }));
    }
  });

  ws.on("close", () => {
    logger.info("WebSocket connection closed");
  });

  ws.on("error", (error) => {
    logger.error("WebSocket error:", error);
  });
}
