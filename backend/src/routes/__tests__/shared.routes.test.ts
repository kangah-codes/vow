import express from "express";
import request from "supertest";

jest.mock("../../controllers/shared.controller", () => ({
	getSharedConversation: jest.fn((_req, res) =>
		res.status(200).json({ ok: "shared" }),
	),
}));

import sharedRoutes from "../shared.routes";
import * as sharedController from "../../controllers/shared.controller";

const createApp = () => {
	const app = express();
	app.use("/shared", sharedRoutes);
	return app;
};

describe("shared routes", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("GET /shared/:accessCode", async () => {
		const app = createApp();
		const res = await request(app).get("/shared/CODE");
		expect(res.status).toBe(200);
		expect(res.body).toEqual({ ok: "shared" });
		expect(sharedController.getSharedConversation).toHaveBeenCalled();
	});
});
