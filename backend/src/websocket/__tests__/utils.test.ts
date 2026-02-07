import jwt from "jsonwebtoken";
import {
	sendEvent,
	sendError,
	verifyToken,
	extractJsonStringField,
	extractMessageField,
	extractSectionContentField,
} from "../utils";
import { env } from "../../config/env";

jest.mock("jsonwebtoken", () => ({
	verify: jest.fn(),
}));

jest.mock("../../config/env", () => ({
	env: { JWT_SECRET: "secret" },
}));

describe("websocket utils", () => {
	it("sendEvent sends typed message", () => {
		const ws = { send: jest.fn() } as any;
		sendEvent(ws, "test", { a: 1 });
		expect(ws.send).toHaveBeenCalledWith(
			JSON.stringify({ type: "test", payload: { a: 1 } }),
		);
	});

	it("sendEvent sends type only when no payload", () => {
		const ws = { send: jest.fn() } as any;
		sendEvent(ws, "pong");
		expect(ws.send).toHaveBeenCalledWith(JSON.stringify({ type: "pong" }));
	});

	it("sendError sends error and optionally closes", () => {
		const ws = { send: jest.fn(), close: jest.fn() } as any;
		sendError(ws, "bad", true);
		expect(ws.send).toHaveBeenCalledWith(
			JSON.stringify({ type: "error", payload: { message: "bad" } }),
		);
		expect(ws.close).toHaveBeenCalled();
	});

	it("verifyToken returns userId on success", () => {
		(jwt.verify as jest.Mock).mockReturnValue({ userId: "u1" });
		const result = verifyToken("token");
		expect(jwt.verify).toHaveBeenCalledWith("token", env.JWT_SECRET);
		expect(result).toBe("u1");
	});

	it("verifyToken returns null on failure", () => {
		(jwt.verify as jest.Mock).mockImplementation(() => {
			throw new Error("bad");
		});
		const result = verifyToken("token");
		expect(result).toBeNull();
	});

	it("extractJsonStringField returns null when missing", () => {
		expect(extractJsonStringField("{}", "message")).toBeNull();
	});

	it("extractJsonStringField extracts partial content", () => {
		const partial = '{"message":"Hello\\nWorld"';
		expect(extractJsonStringField(partial, "message")).toBe("Hello\nWorld");
	});

	it("extractMessageField and extractSectionContentField are wired", () => {
		const partial = '{"message":"Hi","sectionContent":"Summary"';
		expect(extractMessageField(partial)).toBe("Hi");
		expect(extractSectionContentField(partial)).toBe("Summary");
	});
});
