import express from "express";
import request from "supertest";

jest.mock("../../controllers/health.controller", () => ({
	getHealth: jest.fn((_req, res) => res.status(200).json({ ok: "health" })),
}));

import healthRoutes from "../health.routes";
import * as healthController from "../../controllers/health.controller";

const createApp = () => {
	const app = express();
	app.use("/health", healthRoutes);
	return app;
};

describe("health routes", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("GET /health", async () => {
		const app = createApp();
		const res = await request(app).get("/health");
		expect(res.status).toBe(200);
		expect(res.body).toEqual({ ok: "health" });
		expect(healthController.getHealth).toHaveBeenCalled();
	});
});
