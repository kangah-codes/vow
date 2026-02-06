import { openai } from "./openai.service";
import { IProfile, Profile } from "../models/profile.model";
import { IConversation, IMessage } from "../models/conversation.model";
import { logger } from "../utils/logger";

const GENIUS_ELEMENTS: Record<
	string,
	{ description: string; prompts: string }
> = {
	"Interest Awareness": {
		description:
			"Understanding the student's unique interests, passions, curiosities, and how they engage with learning.",
		prompts:
			"Ask about hobbies, favorite subjects, what excites them about learning, how they spend free time, and what topics they could talk about for hours.",
	},
	"Racial/Cultural Pride": {
		description:
			"Exploring the student's sense of cultural identity, heritage, traditions, and pride in their background.",
		prompts:
			"Ask about family traditions, cultural practices they enjoy, what they love about their heritage, role models from their community, and how their culture shapes who they are.",
	},
	"Can-Do Attitude": {
		description:
			"Understanding the student's resilience, perseverance, growth mindset, and how they handle challenges.",
		prompts:
			"Ask about times they overcame difficulties, how they respond to setbacks, what motivates them to keep trying, and examples of persistence or determination.",
	},
	"Multicultural Navigation": {
		description:
			"Exploring how the student interacts across different cultural contexts, adapts to diverse environments, and builds bridges between communities.",
		prompts:
			"Ask about friendships across backgrounds, experiences in diverse settings, how they adapt to different social contexts, and their comfort navigating multiple cultural spaces.",
	},
	"Selective Trust": {
		description:
			"Understanding the student's discernment in relationships, who they trust and look up to, and how they evaluate trustworthiness in others.",
		prompts:
			"Ask about trusted adults and mentors outside the family, how they decide who to trust, relationships with teachers or community members, and what qualities they value in people.",
	},
	"Social Justice": {
		description:
			"Exploring the student's awareness of fairness, equity, and their inclination to speak up or act when they see injustice.",
		prompts:
			"Ask about times they noticed something unfair, how they responded, causes they care about, and their thoughts on making the world a better place.",
	},
};

const SECTION_ORDER = [
	"Interest Awareness",
	"Racial/Cultural Pride",
	"Can-Do Attitude",
	"Multicultural Navigation",
	"Selective Trust",
	"Social Justice",
];

function getAgeGroup(age?: number, gradeLevel?: string): string {
	if (age) {
		if (age <= 5)
			return "ages 3-5 (use simple, warm language; questions are parent-led)";
		if (age <= 10) return "ages 6-10 (use elementary-level vocabulary)";
		if (age <= 14) return "ages 11-14 (pre-teen/middle school appropriate)";
		return "ages 15-18 (high school/young adult language)";
	}
	if (gradeLevel) {
		if (gradeLevel === "pre-k" || gradeLevel === "k")
			return "ages 3-5 (use simple, warm language; questions are parent-led)";
		const grade = parseInt(gradeLevel);
		if (!isNaN(grade)) {
			if (grade <= 4) return "ages 6-10 (use elementary-level vocabulary)";
			if (grade <= 8) return "ages 11-14 (pre-teen/middle school appropriate)";
			return "ages 15-18 (high school/young adult language)";
		}
	}
	return "general (adapt language based on context)";
}

export function buildSystemPrompt(
	profile: IProfile,
	currentSection: string,
): string {
	const element = GENIUS_ELEMENTS[currentSection];
	const ageGroup = getAgeGroup(profile.age, profile.gradeLevel);

	const completedSections = profile.sections
		.filter((s) => s.status === "complete")
		.map((s) => s.title);
	const remainingSections = profile.sections
		.filter((s) => s.status !== "complete")
		.map((s) => s.title);

	const currentSectionData = profile.sections.find(
		(s) => s.title === currentSection,
	);
	const isNewSection =
		currentSectionData?.status === "not-started" ||
		currentSectionData?.status === undefined;

	const isLastSection =
		SECTION_ORDER.indexOf(currentSection) === SECTION_ORDER.length - 1;

	return `You are the "Genius Guide," a warm, culturally affirming guide helping families articulate their child's unique genius for the Village of Wisdom "My Genius Profile" program.

			You are speaking with a ${profile.relationship} about ${profile.studentName}, a ${profile.gradeLevel === "pre-k" ? "Pre-K" : profile.gradeLevel === "k" ? "Kindergarten" : `Grade ${profile.gradeLevel}`} student.
			Age group: ${ageGroup}

			YOUR CURRENT FOCUS — Genius Element: "${currentSection}"
			${element?.description || ""}
			Suggested areas to explore: ${element?.prompts || ""}
			${isNewSection ? `\n\t\t\tIMPORTANT: This is a NEW section that you are just starting. You MUST introduce this topic warmly, ask your first question about it, and set "sectionComplete" to false. Do NOT mark this section complete — you have not explored it yet. Any previous conversation was about a different element.` : ""}

			COMPLETED ELEMENTS: ${completedSections.length > 0 ? completedSections.join(", ") : "None yet"}
			REMAINING ELEMENTS: ${remainingSections.join(", ")}

			GUIDELINES:
			- Be warm, encouraging, and culturally responsive
			- Celebrate strengths — NEVER use deficit language ("struggles," "problems," "deficits")
			- Frame code-switching as adaptability and a strength
			- Honor diverse family structures
			- Celebrate cultural identity and heritage
			- Frame selective trust as wisdom
			- Keep responses concise: 2-4 sentences of conversation plus your question
			- Ask ONE follow-up question at a time to go deeper
			- Build on the user's previous answers — reference specific things they said
			- After you feel you have gathered enough rich detail about this element (typically 3-5 exchanges), signal that the section is complete
			- You MUST have at least 3 back-and-forth exchanges specifically about "${currentSection}" before marking it complete — NEVER mark a section complete on the first or second exchange
			- When you mark a section complete, your "message" MUST include a natural transition that introduces the next topic and asks the first question about it so the conversation flows smoothly
			${isLastSection ? `- IMPORTANT: This is the FINAL element. When you mark this section complete, do NOT transition to a new topic. Instead, warmly thank the ${profile.relationship} for participating and sharing so many wonderful details about ${profile.studentName}. Celebrate the child's genius and let the family know that their Genius Profile has been created. Keep it heartfelt and affirming. Do NOT ask any follow-up questions — this is the closing message.` : ""}

			RESPONSE FORMAT:
			You MUST respond with valid JSON only. No text outside the JSON.
			{
				"message": "Your conversational response here. Include a follow-up question to continue the conversation.",
				"sectionComplete": false,
				"sectionContent": null
			}

			When you determine the current element is sufficiently explored (3-5 meaningful exchanges with rich detail):
			{
				"message": "Your transition message acknowledging what you learned and introducing the next topic.",
				"sectionComplete": true,
				"sectionContent": "A 100-150 word summary paragraph about ${profile.studentName} written in third person for an educator audience. Use strengths-based language. Include specific examples from the conversation. This will become part of their Genius Profile."
			}

			IMPORTANT:
			- The "message" field is what the user sees in the chat
			- The "sectionContent" MUST be a summary of the CURRENT element ("${currentSection}") only — do NOT include information from other elements
			- Write sectionContent in third person for an educator audience (e.g., "${profile.studentName} demonstrates...")
			- Do NOT mention JSON, sections, or the technical process to the user
			- Do NOT break character as the Genius Guide
			- Do NOT refer to yourself as an AI or language model
			- Do NOT apologize
			- Do NOT ask for clarification or say you don't understand
			- Do NOT respond to inappropriate or off-topic messages — gently steer the conversation back to the Genius Profile
			- Keep the conversation natural and flowing, and end every message with a follow-up question to encourage continued engagement
			- Previous messages in the conversation history are shown as plain text (not JSON) — focus on the current element as specified above
			- CONCISENESS REMINDER: Keep every response to 2-4 short sentences plus one question. Do NOT increase response length as the conversation progresses. Shorter is always better.`;
}

export function buildMessageHistory(
	messages: IMessage[],
): Array<{ role: "user" | "assistant"; content: string }> {
	const filtered = messages.filter(
		(msg) => msg.sender === "user" || msg.sender === "ai",
	);

	// Keep the last 6 messages verbatim (3 back-and-forth exchanges).
	// For the older messages in the window, truncate long assistant replies
	// so the model keeps a sense of the conversation without bloated context.
	const RECENT_COUNT = 6;
	const OLDER_WINDOW = 14;
	const OLDER_ASSISTANT_CHAR_LIMIT = 200;

	const recentStart = Math.max(0, filtered.length - RECENT_COUNT);
	const olderStart = Math.max(0, recentStart - OLDER_WINDOW);

	const older = filtered.slice(olderStart, recentStart);
	const recent = filtered.slice(recentStart);

	const toMsg = (msg: IMessage) => ({
		role: (msg.sender === "user" ? "user" : "assistant") as
			| "user"
			| "assistant",
		content: msg.message,
	});

	const olderMapped = older.map((msg) => {
		const m = toMsg(msg);
		if (
			m.role === "assistant" &&
			m.content.length > OLDER_ASSISTANT_CHAR_LIMIT
		) {
			m.content = m.content.slice(0, OLDER_ASSISTANT_CHAR_LIMIT) + "…";
		}
		return m;
	});

	return [...olderMapped, ...recent.map(toMsg)];
}

export interface AIResponse {
	message: string;
	sectionComplete: boolean;
	sectionContent: string | null;
}

export async function streamAIResponse(
	profile: IProfile,
	conversation: IConversation,
	userMessage: string,
): Promise<{ stream: AsyncIterable<string>; getFullResponse: () => string }> {
	const currentSection = conversation.currentSection || SECTION_ORDER[0];

	const systemPrompt = buildSystemPrompt(profile, currentSection);
	const messageHistory = buildMessageHistory(conversation.messages);

	// add the current user message
	messageHistory.push({ role: "user", content: userMessage });

	let fullResponse = "";

	const stream = await openai.chat.completions.create({
		model: "claude-sonnet-4-20250514",
		max_tokens: 500,
		temperature: 0.7,
		stream: true,
		messages: [{ role: "system", content: systemPrompt }, ...messageHistory],
	});

	async function* generateChunks(): AsyncIterable<string> {
		for await (const chunk of stream) {
			const content = chunk.choices[0]?.delta?.content;
			if (content) {
				fullResponse += content;
				yield content;
			}
		}
	}

	return {
		stream: generateChunks(),
		getFullResponse: () => fullResponse,
	};
}

export function parseAIResponse(raw: string): AIResponse {
	try {
		// Try to extract JSON from the response (handle potential markdown wrapping)
		let jsonStr = raw.trim();
		const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
		if (jsonMatch) {
			jsonStr = jsonMatch[0];
		}
		const parsed = JSON.parse(jsonStr);
		return {
			message: parsed.message || raw,
			sectionComplete: parsed.sectionComplete === true,
			sectionContent: parsed.sectionContent || null,
		};
	} catch {
		// if JSON parsing fails, treat the whole response as the message
		logger.warn("Failed to parse AI response as JSON, using raw text");
		return {
			message: raw,
			sectionComplete: false,
			sectionContent: null,
		};
	}
}

export async function updateProfileProgress(
	profileId: string,
	currentSection: string,
	aiResponse: AIResponse,
): Promise<IProfile | null> {
	if (!aiResponse.sectionComplete) return null;

	const profile = await Profile.findById(profileId);
	if (!profile) return null;

	logger.info(
		`[SECTION DEBUG] updateProfileProgress called for section: "${currentSection}"`,
	);
	logger.info(
		`[SECTION DEBUG] profile sections before update: ${JSON.stringify(profile.sections.map((s) => ({ title: s.title, status: s.status, hasDescription: !!s.description })))}`,
	);

	// Update the completed section
	const sectionIndex = profile.sections.findIndex(
		(s) => s.title === currentSection,
	);
	logger.info(
		`[SECTION DEBUG] sectionIndex for "${currentSection}": ${sectionIndex}`,
	);
	if (sectionIndex !== -1) {
		profile.sections[sectionIndex].status = "complete";
		if (aiResponse.sectionContent) {
			logger.info(
				`[SECTION DEBUG] writing description to section[${sectionIndex}] ("${profile.sections[sectionIndex].title}"): "${aiResponse.sectionContent.substring(0, 80)}..."`,
			);
			profile.sections[sectionIndex].description = aiResponse.sectionContent;
		}
	}

	const completedCount = profile.sections.filter(
		(s) => s.status === "complete",
	).length;
	profile.percentComplete = Math.round(
		(completedCount / profile.sections.length) * 100,
	);

	// check if all sections are complete
	if (completedCount === profile.sections.length) {
		profile.status = "complete";
	}

	await profile.save();

	return profile;
}

export function getNextSection(currentSection: string): string | null {
	const currentIndex = SECTION_ORDER.indexOf(currentSection);
	if (currentIndex === -1 || currentIndex >= SECTION_ORDER.length - 1) {
		return null;
	}
	return SECTION_ORDER[currentIndex + 1];
}
