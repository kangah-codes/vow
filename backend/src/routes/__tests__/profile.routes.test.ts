import express from "express";
import request from "supertest";

jest.mock("../../controllers/profile.controller", () => ({
	getProfiles: jest.fn((_req, res) => res.status(200).json({ ok: "list" })),
	createProfile: jest.fn((_req, res) => res.status(201).json({ ok: "create" })),
	deleteProfile: jest.fn((_req, res) => res.status(200).json({ ok: "delete" })),
}));

jest.mock("../../middleware/auth.middleware", () => ({
	requireAuth: (_req: unknown, _res: unknown, next: () => void) => next(),
}));

import profileRoutes from "../profile.routes";
import * as profileController from "../../controllers/profile.controller";

const createApp = () => {
	const app = express();
	app.use(express.json());
	app.use("/profiles", profileRoutes);
	return app;
};

describe("profile routes", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("GET /profiles", async () => {
		const app = createApp();
		const res = await request(app).get("/profiles");
		expect(res.status).toBe(200);
		expect(res.body).toEqual({ ok: "list" });
		expect(profileController.getProfiles).toHaveBeenCalled();
	});

	it("POST /profiles", async () => {
		const app = createApp();
		const res = await request(app).post("/profiles").send({});
		expect(res.status).toBe(201);
		expect(res.body).toEqual({ ok: "create" });
		expect(profileController.createProfile).toHaveBeenCalled();
	});

	it("DELETE /profiles/:id", async () => {
		const app = createApp();
		const res = await request(app).delete("/profiles/abc");
		expect(res.status).toBe(200);
		expect(res.body).toEqual({ ok: "delete" });
		expect(profileController.deleteProfile).toHaveBeenCalled();
	});
});
