import dotenv from "dotenv";

dotenv.config();

export const env = {
	PORT: parseInt(process.env.PORT || "3001", 10),
	MONGODB_URI: process.env.MONGODB_URI || "mongodb://localhost:27017/vow-app",
	ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY || "",
	JWT_SECRET: process.env.JWT_SECRET || "dev-jwt-secret",
	JWT_REFRESH_SECRET:
		process.env.JWT_REFRESH_SECRET || "dev-jwt-refresh-secret",
	NODE_ENV: process.env.NODE_ENV || "development",
	COMPLETIONS_MODEL:
		process.env.COMPLETIONS_MODEL || "claude-sonnet-4-20250514",
};
