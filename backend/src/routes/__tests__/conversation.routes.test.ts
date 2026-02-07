import express from "express";
import request from "supertest";

jest.mock("../../controllers/conversation.controller", () => ({
	getConversation: jest.fn((_req, res) =>
		res.status(200).json({ ok: "conversation" }),
	),
}));

jest.mock("../../middleware/auth.middleware", () => ({
	requireAuth: (_req: unknown, _res: unknown, next: () => void) => next(),
}));

import conversationRoutes from "../conversation.routes";
import * as conversationController from "../../controllers/conversation.controller";

const createApp = () => {
	const app = express();
	app.use("/conversations", conversationRoutes);
	return app;
};

describe("conversation routes", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("GET /conversations/:id", async () => {
		const app = createApp();
		const res = await request(app).get("/conversations/abc");
		expect(res.status).toBe(200);
		expect(res.body).toEqual({ ok: "conversation" });
		expect(conversationController.getConversation).toHaveBeenCalled();
	});
});
