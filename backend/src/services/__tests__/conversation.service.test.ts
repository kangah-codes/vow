import {
	parseAIResponse,
	getNextSection,
	buildMessageHistory,
	updateProfileProgress,
	streamAIResponse,
	streamSectionSummary,
} from "../conversation.service";
import { Profile } from "../../models/profile.model";
import { openai } from "../openai.service";

jest.mock("../openai.service", () => ({
	openai: {
		chat: {
			completions: {
				create: jest.fn(),
			},
		},
	},
}));

jest.mock("../../utils/logger", () => ({
	logger: {
		info: jest.fn(),
		warn: jest.fn(),
		error: jest.fn(),
		debug: jest.fn(),
	},
}));

jest.mock("../../models/profile.model", () => ({
	Profile: {
		findById: jest.fn(),
	},
}));

describe("conversation.service", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("parseAIResponse handles JSON", () => {
		const result = parseAIResponse(
			'{"message":"hi","sectionComplete":true,"sectionContent":"summary"}',
		);
		expect(result).toEqual({
			message: "hi",
			sectionComplete: true,
			sectionContent: "summary",
		});
	});

	it("parseAIResponse falls back on raw text", () => {
		const result = parseAIResponse("plain text");
		expect(result).toEqual({
			message: "plain text",
			sectionComplete: false,
			sectionContent: null,
		});
	});

	it("getNextSection returns next section", () => {
		expect(getNextSection("Interest Awareness")).toBe("Racial/Cultural Pride");
		expect(getNextSection("Social Justice")).toBeNull();
	});

	it("buildMessageHistory truncates older assistant messages", () => {
		const messages = [
			{ sender: "user", message: "u1" },
			{ sender: "ai", message: "a1".repeat(300) },
			{ sender: "user", message: "u2" },
			{ sender: "ai", message: "a2" },
			{ sender: "user", message: "u3" },
			{ sender: "ai", message: "a3" },
			{ sender: "user", message: "u4" },
			{ sender: "ai", message: "a4" },
		] as any;

		const history = buildMessageHistory(messages);
		const longAssistant = history.find(
			(m) => m.role === "assistant" && m.content.startsWith("a1"),
		);
		expect(longAssistant?.content.endsWith("…")).toBe(true);
	});

	it("updateProfileProgress returns null when sectionComplete false", async () => {
		const result = await updateProfileProgress("id", "Interest Awareness", {
			message: "hi",
			sectionComplete: false,
			sectionContent: null,
		});
		expect(result).toBeNull();
	});

	it("updateProfileProgress updates profile and sections", async () => {
		const save = jest.fn();
		const profile = {
			sections: [
				{ title: "Interest Awareness", status: "in-progress", description: "" },
				{ title: "Racial/Cultural Pride", status: "not-started" },
			],
			percentComplete: 0,
			status: "in-progress",
			save,
		} as any;
		(Profile.findById as jest.Mock).mockResolvedValue(profile);

		const updated = await updateProfileProgress("id", "Interest Awareness", {
			message: "hi",
			sectionComplete: true,
			sectionContent: "summary",
		});

		expect(profile.sections[0].status).toBe("complete");
		expect(profile.sections[0].description).toBe("summary");
		expect(profile.percentComplete).toBe(50);
		expect(updated).toBe(profile);
		expect(save).toHaveBeenCalled();
	});

	it("streamAIResponse yields chunks and collects full response", async () => {
		const stream = async function* () {
			yield {
				choices: [{ delta: { content: "{\"message\":\"hi\"" } }],
			};
			yield {
				choices: [{ delta: { content: ",\"sectionComplete\":false}" } }],
			};
		}();

		(openai.chat.completions.create as jest.Mock).mockResolvedValue(stream);

		const profile = {
			studentName: "Student",
			relationship: "parent",
			gradeLevel: "3",
			sections: [
				{ title: "Interest Awareness", status: "in-progress", description: "" },
				{ title: "Racial/Cultural Pride", status: "not-started" },
			],
		};
		const conversation = {
			currentSection: "Interest Awareness",
			messages: [
				{ sender: "user", message: "u1" },
				{ sender: "ai", message: "a1" },
			],
		};

		const { stream: responseStream, getFullResponse } = await streamAIResponse(
			profile as any,
			conversation as any,
			"hello",
		);

		let collected = "";
		for await (const chunk of responseStream) {
			collected += chunk;
		}

		expect(collected).toContain("\"message\":\"hi\"");
		expect(getFullResponse()).toContain("sectionComplete");
		expect(openai.chat.completions.create).toHaveBeenCalled();
	});

	it("streamSectionSummary yields summary chunks", async () => {
		const stream = async function* () {
			yield { choices: [{ delta: { content: "Summary" } }] };
		}();

		(openai.chat.completions.create as jest.Mock).mockResolvedValue(stream);

		const profile = {
			studentName: "Student",
			relationship: "parent",
			gradeLevel: "3",
			sections: [
				{ title: "Interest Awareness", status: "complete" },
			],
		};
		const conversation = {
			messages: [{ sender: "user", message: "u1" }],
		};

		const { stream: responseStream, getFullResponse } =
			await streamSectionSummary(
				profile as any,
				conversation as any,
				"Interest Awareness",
			);

		let collected = "";
		for await (const chunk of responseStream) {
			collected += chunk;
		}

		expect(collected).toBe("Summary");
		expect(getFullResponse()).toBe("Summary");
	});
});
