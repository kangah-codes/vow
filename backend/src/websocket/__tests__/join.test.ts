import { handleJoin } from "../handlers/join";
import { Conversation } from "../../models/conversation.model";
import { sendEvent, sendError, verifyToken } from "../utils";

jest.mock("../../models/conversation.model", () => ({
	Conversation: {
		findOne: jest.fn(),
	},
}));

jest.mock("../utils", () => ({
	sendEvent: jest.fn(),
	sendError: jest.fn(),
	verifyToken: jest.fn(),
}));

jest.mock("../../utils/logger", () => ({
	logger: {
		info: jest.fn(),
		warn: jest.fn(),
		error: jest.fn(),
		debug: jest.fn(),
	},
}));

describe("handleJoin", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("requires token", async () => {
		const ws = {} as any;
		const result = await handleJoin(ws, { conversationId: "c1" });
		expect(result).toBeNull();
		expect(sendError).toHaveBeenCalledWith(
			ws,
			"You must be signed in to perform this action",
			true,
		);
	});

	it("rejects invalid token", async () => {
		const ws = {} as any;
		(verifyToken as jest.Mock).mockReturnValue(null);

		const result = await handleJoin(ws, { token: "t", conversationId: "c1" });
		expect(result).toBeNull();
		expect(sendError).toHaveBeenCalledWith(ws, "Invalid token", true);
	});

	it("requires conversation id", async () => {
		const ws = {} as any;
		(verifyToken as jest.Mock).mockReturnValue("u1");

		const result = await handleJoin(ws, { token: "t" });
		expect(result).toBeNull();
		expect(sendError).toHaveBeenCalledWith(ws, "Conversation ID required", true);
	});

	it("rejects missing conversation", async () => {
		const ws = {} as any;
		(verifyToken as jest.Mock).mockReturnValue("u1");
		(Conversation.findOne as jest.Mock).mockResolvedValue(null);

		const result = await handleJoin(ws, { token: "t", conversationId: "c1" });
		expect(result).toBeNull();
		expect(sendError).toHaveBeenCalledWith(ws, "Conversation not found", true);
	});

	it("returns session info on success", async () => {
		const ws = {} as any;
		(verifyToken as jest.Mock).mockReturnValue("u1");
		(Conversation.findOne as jest.Mock).mockResolvedValue({ _id: "c1" });

		const result = await handleJoin(ws, { token: "t", conversationId: "c1" });

		expect(sendEvent).toHaveBeenCalledWith(ws, "joined", { conversationId: "c1" });
		expect(result).toEqual({ userId: "u1", conversationId: "c1" });
	});
});
