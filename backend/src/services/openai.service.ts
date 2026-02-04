import OpenAI from "openai";
import { env } from "../config/env";

const openai = new OpenAI({
	apiKey: env.ANTHROPIC_API_KEY,
	baseURL: "https://api.anthropic.com/v1/",
});

export { openai };
