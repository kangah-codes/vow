import { handleWebSocketConnection } from "../handler";
import { sendEvent, sendError } from "../utils";
import { handleJoin } from "../handlers/join";
import { handleSendMessage } from "../handlers/sendMessage";

jest.mock("../utils", () => ({
	sendEvent: jest.fn(),
	sendError: jest.fn(),
}));

jest.mock("../handlers/join", () => ({
	handleJoin: jest.fn(),
}));

jest.mock("../handlers/sendMessage", () => ({
	handleSendMessage: jest.fn(),
}));

jest.mock("../../utils/logger", () => ({
	logger: {
		info: jest.fn(),
		warn: jest.fn(),
		error: jest.fn(),
		debug: jest.fn(),
	},
}));

describe("handleWebSocketConnection", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	const createWs = () => {
		const handlers: Record<string, Function> = {};
		const ws = {
			on: jest.fn((event: string, cb: Function) => {
				handlers[event] = cb;
			}),
			send: jest.fn(),
			close: jest.fn(),
			readyState: 1,
		};
		return { ws, handlers };
	};

	it("responds to ping", async () => {
		const { ws, handlers } = createWs();
		handleWebSocketConnection(ws as any, {} as any);

		await handlers.message(Buffer.from(JSON.stringify({ type: "ping", payload: {} })));

		expect(sendEvent).toHaveBeenCalledWith(ws, "pong");
	});

	it("handles join and stores session", async () => {
		const { ws, handlers } = createWs();
		(handleJoin as jest.Mock).mockResolvedValue({
			userId: "u1",
			conversationId: "c1",
		});
		handleWebSocketConnection(ws as any, {} as any);

		await handlers.message(
			Buffer.from(JSON.stringify({ type: "join", payload: { token: "t", conversationId: "c1" } })),
		);

		// send_message now should be allowed
		await handlers.message(
			Buffer.from(JSON.stringify({ type: "send_message", payload: { message: "hi" } })),
		);

		expect(handleSendMessage).toHaveBeenCalledWith(ws, "u1", "c1", "hi");
	});

	it("rejects send_message before join", async () => {
		const { ws, handlers } = createWs();
		handleWebSocketConnection(ws as any, {} as any);

		await handlers.message(
			Buffer.from(JSON.stringify({ type: "send_message", payload: { message: "hi" } })),
		);

		expect(sendError).toHaveBeenCalledWith(ws, "Not joined to a conversation");
	});

	it("ignores empty send_message", async () => {
		const { ws, handlers } = createWs();
		(handleJoin as jest.Mock).mockResolvedValue({
			userId: "u1",
			conversationId: "c1",
		});
		handleWebSocketConnection(ws as any, {} as any);

		await handlers.message(
			Buffer.from(JSON.stringify({ type: "join", payload: { token: "t", conversationId: "c1" } })),
		);
		await handlers.message(
			Buffer.from(JSON.stringify({ type: "send_message", payload: { message: "   " } })),
		);

		expect(handleSendMessage).not.toHaveBeenCalled();
	});

	it("handles invalid JSON", async () => {
		const { ws, handlers } = createWs();
		handleWebSocketConnection(ws as any, {} as any);

		await handlers.message(Buffer.from("not-json"));

		expect(sendError).toHaveBeenCalledWith(ws, "Invalid message format");
	});
});
