import mongoose from "mongoose";
import { env } from "./env";
import { logger } from "../utils/logger";

type MongooseCache = {
	conn: typeof mongoose | null;
	promise: Promise<typeof mongoose> | null;
};

const globalCache = globalThis as typeof globalThis & {
	mongooseCache?: MongooseCache;
};

const cached =
	globalCache.mongooseCache ??
	(globalCache.mongooseCache = { conn: null, promise: null });

export async function connectDB(): Promise<void> {
	if (mongoose.connection.readyState === 1) return;
	if (cached.conn) return;

	try {
		if (!cached.promise) {
			cached.promise = mongoose.connect(env.MONGODB_URI);
		}
		cached.conn = await cached.promise;
		logger.info("Connected to MongoDB");
	} catch (error) {
		cached.promise = null;
		logger.error("MongoDB connection error:", error);
		process.exit(1);
	}
}
