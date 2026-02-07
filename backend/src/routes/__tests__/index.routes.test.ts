import express from "express";
import request from "supertest";

jest.mock("../../controllers/health.controller", () => ({
	getHealth: jest.fn((_req, res) => res.status(200).json({ ok: "health" })),
}));

jest.mock("../../controllers/auth.controller", () => ({
	signup: jest.fn((_req, res) => res.status(201).json({ ok: "signup" })),
	login: jest.fn((_req, res) => res.status(200).json({ ok: "login" })),
	getMe: jest.fn((_req, res) => res.status(200).json({ ok: "me" })),
	logout: jest.fn((_req, res) => res.status(200).json({ ok: "logout" })),
	forgotPassword: jest.fn((_req, res) => res.status(200).json({ ok: "forgot" })),
	resetPassword: jest.fn((_req, res) => res.status(200).json({ ok: "reset" })),
	updateFocusGroup: jest.fn((_req, res) => res.status(200).json({ ok: "focus" })),
}));

jest.mock("../../controllers/shared.controller", () => ({
	getSharedConversation: jest.fn((_req, res) =>
		res.status(200).json({ ok: "shared" }),
	),
}));

jest.mock("../../controllers/profile.controller", () => ({
	getProfiles: jest.fn((_req, res) => res.status(200).json({ ok: "profiles" })),
	createProfile: jest.fn((_req, res) => res.status(201).json({ ok: "create" })),
	deleteProfile: jest.fn((_req, res) => res.status(200).json({ ok: "delete" })),
}));

jest.mock("../../controllers/conversation.controller", () => ({
	getConversation: jest.fn((_req, res) =>
		res.status(200).json({ ok: "conversation" }),
	),
}));

jest.mock("../../middleware/auth.middleware", () => ({
	requireAuth: (_req: unknown, _res: unknown, next: () => void) => next(),
}));

import routes from "../index";
import * as healthController from "../../controllers/health.controller";
import * as authController from "../../controllers/auth.controller";
import * as profileController from "../../controllers/profile.controller";
import * as conversationController from "../../controllers/conversation.controller";
import * as sharedController from "../../controllers/shared.controller";

const createApp = () => {
	const app = express();
	app.use(express.json());
	app.use("/api", routes);
	return app;
};

describe("index routes", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("routes health through /api/health", async () => {
		const app = createApp();
		const res = await request(app).get("/api/health");
		expect(res.status).toBe(200);
		expect(res.body).toEqual({ ok: "health" });
		expect(healthController.getHealth).toHaveBeenCalled();
	});

	it("routes auth through /api/auth/signup", async () => {
		const app = createApp();
		const res = await request(app).post("/api/auth/signup");
		expect(res.status).toBe(201);
		expect(res.body).toEqual({ ok: "signup" });
		expect(authController.signup).toHaveBeenCalled();
	});

	it("routes profiles through /api/profiles", async () => {
		const app = createApp();
		const res = await request(app).get("/api/profiles");
		expect(res.status).toBe(200);
		expect(res.body).toEqual({ ok: "profiles" });
		expect(profileController.getProfiles).toHaveBeenCalled();
	});

	it("routes conversations through /api/conversations/:id", async () => {
		const app = createApp();
		const res = await request(app).get("/api/conversations/abc");
		expect(res.status).toBe(200);
		expect(res.body).toEqual({ ok: "conversation" });
		expect(conversationController.getConversation).toHaveBeenCalled();
	});

	it("routes shared through /api/shared/:accessCode", async () => {
		const app = createApp();
		const res = await request(app).get("/api/shared/CODE");
		expect(res.status).toBe(200);
		expect(res.body).toEqual({ ok: "shared" });
		expect(sharedController.getSharedConversation).toHaveBeenCalled();
	});
});
