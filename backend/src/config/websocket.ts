import { Server as HTTPServer } from "http";
import { WebSocketServer } from "ws";
import { handleWebSocketConnection } from "../websocket/handler";
import { logger } from "../utils/logger";

export function setupWebSocket(server: HTTPServer): WebSocketServer {
  const wss = new WebSocketServer({ server });

  wss.on("connection", handleWebSocketConnection);

  wss.on("error", (error) => {
    logger.error("WebSocket server error:", error);
  });

  logger.info("WebSocket server initialized");
  return wss;
}
