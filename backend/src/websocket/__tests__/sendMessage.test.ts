import { handleSendMessage } from "../handlers/sendMessage";
import { Conversation } from "../../models/conversation.model";
import { Profile } from "../../models/profile.model";
import {
	streamAIResponse,
	parseAIResponse,
	updateProfileProgress,
	getNextSection,
} from "../../services/conversation.service";
import {
	sendEvent,
	sendError,
	extractMessageField,
	extractSectionContentField,
} from "../utils";

jest.mock("ws", () => ({ WebSocket: { OPEN: 1 } }));

jest.mock("../../models/conversation.model", () => ({
	Conversation: {
		findById: jest.fn(),
		findByIdAndUpdate: jest.fn(),
	},
}));

jest.mock("../../models/profile.model", () => ({
	Profile: {
		findById: jest.fn(),
	},
}));

jest.mock("../../services/conversation.service", () => ({
	streamAIResponse: jest.fn(),
	parseAIResponse: jest.fn(),
	updateProfileProgress: jest.fn(),
	getNextSection: jest.fn(),
}));

jest.mock("../utils", () => ({
	sendEvent: jest.fn(),
	sendError: jest.fn(),
	extractMessageField: jest.fn(),
	extractSectionContentField: jest.fn(),
}));

jest.mock("../../utils/logger", () => ({
	logger: {
		info: jest.fn(),
		warn: jest.fn(),
		error: jest.fn(),
		debug: jest.fn(),
	},
}));

describe("handleSendMessage", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("returns early on blank message", async () => {
		const ws = { readyState: 1 } as any;
		await handleSendMessage(ws, "u1", "c1", "   ");
		expect(Conversation.findById).not.toHaveBeenCalled();
	});

	it("returns when conversation not found", async () => {
		const ws = { readyState: 1 } as any;
		(Conversation.findById as jest.Mock).mockResolvedValue(null);

		await handleSendMessage(ws, "u1", "c1", "hi");

		expect(Profile.findById).not.toHaveBeenCalled();
	});

	it("returns when profile not found", async () => {
		const ws = { readyState: 1 } as any;
		(Conversation.findById as jest.Mock).mockResolvedValue({ profileId: "p1" });
		(Profile.findById as jest.Mock).mockResolvedValue(null);

		await handleSendMessage(ws, "u1", "c1", "hi");

		expect(sendEvent).not.toHaveBeenCalled();
	});

	it("sends error when profile complete", async () => {
		const ws = { readyState: 1 } as any;
		(Conversation.findById as jest.Mock).mockResolvedValue({ profileId: "p1" });
		(Profile.findById as jest.Mock).mockResolvedValue({ status: "complete" });

		await handleSendMessage(ws, "u1", "c1", "hi");

		expect(sendError).toHaveBeenCalledWith(
			ws,
			"This profile is already complete. No further messages can be sent.",
		);
	});

	it("streams AI response and completes section", async () => {
		const ws = { readyState: 1 } as any;

		const conversation = {
			profileId: "p1",
			currentSection: "Interest Awareness",
			messages: [] as any[],
			save: jest.fn(),
		};
		const updatedConv = {
			messages: [
				{ _id: "m1", sender: "ai", senderName: "Genius Guide", message: "Final", timestamp: new Date() },
			],
		};

		(Conversation.findById as jest.Mock)
			.mockResolvedValueOnce(conversation)
			.mockResolvedValueOnce(updatedConv);
		(Conversation.findByIdAndUpdate as jest.Mock).mockResolvedValue(undefined);

		const profile = {
			_id: "p1",
			status: "in-progress",
			sections: [
				{ title: "Interest Awareness", status: "not-started" },
			],
			save: jest.fn(),
		};
		(Profile.findById as jest.Mock).mockResolvedValue(profile);

		const stream = async function* () {
			yield "chunk";
		}();
		(streamAIResponse as jest.Mock).mockResolvedValue({
			stream,
			getFullResponse: () => "{\"message\":\"Final\",\"sectionComplete\":true}",
		});
		(parseAIResponse as jest.Mock).mockReturnValue({
			message: "Final",
			sectionComplete: true,
			sectionContent: "Summary",
		});
		(getNextSection as jest.Mock).mockReturnValue("Next");
		(updateProfileProgress as jest.Mock).mockResolvedValue({
			sections: [],
			percentComplete: 50,
			status: "in-progress",
		});

		(extractMessageField as jest.Mock).mockReturnValue("Partial");
		(extractSectionContentField as jest.Mock).mockReturnValue("Summary");

		await handleSendMessage(ws, "u1", "c1", "hi");

		expect(sendEvent).toHaveBeenCalledWith(
			ws,
			"message_saved",
			expect.objectContaining({ message: "hi" }),
		);
		expect(sendEvent).toHaveBeenCalledWith(ws, "ai_typing");
		expect(sendEvent).toHaveBeenCalledWith(ws, "ai_stream_start");
		expect(sendEvent).toHaveBeenCalledWith(
			ws,
			"ai_stream_chunk",
			expect.objectContaining({ full: "Partial" }),
		);
		expect(sendEvent).toHaveBeenCalledWith(
			ws,
			"section_content_chunk",
			expect.objectContaining({ sectionTitle: "Interest Awareness" }),
		);
		expect(sendEvent).toHaveBeenCalledWith(
			ws,
			"ai_stream_end",
			expect.objectContaining({ message: "Final" }),
		);
		expect(sendEvent).toHaveBeenCalledWith(
			ws,
			"section_complete",
			expect.objectContaining({ percentComplete: 50 }),
		);
	});

	it("sends error when AI throws", async () => {
		const ws = { readyState: 1 } as any;

		const conversation = {
			profileId: "p1",
			messages: [] as any[],
			save: jest.fn(),
		};
		(Conversation.findById as jest.Mock).mockResolvedValue(conversation);
		(Profile.findById as jest.Mock).mockResolvedValue({
			_id: "p1",
			status: "in-progress",
			sections: [],
		});
		(streamAIResponse as jest.Mock).mockRejectedValue(new Error("bad"));

		await handleSendMessage(ws, "u1", "c1", "hi");

		expect(sendError).toHaveBeenCalledWith(
			ws,
			"I'm having trouble responding right now. Please try again.",
		);
	});
});
