import { createServer } from "http";
import app from "./app";
import { env } from "./config/env";
import { connectDB } from "./config/db";
import { setupWebSocket } from "./config/websocket";
import { logger } from "./utils/logger";

const server = createServer(app);

setupWebSocket(server);

connectDB().then(() => {
  server.listen(env.PORT, () => {
    logger.info(`Server running on port ${env.PORT}`);
  });
});
