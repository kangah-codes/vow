import express from "express";
import request from "supertest";

jest.mock("../../controllers/auth.controller", () => ({
	signup: jest.fn((_req, res) => res.status(201).json({ ok: "signup" })),
	login: jest.fn((_req, res) => res.status(200).json({ ok: "login" })),
	getMe: jest.fn((_req, res) => res.status(200).json({ ok: "me" })),
	logout: jest.fn((_req, res) => res.status(200).json({ ok: "logout" })),
	forgotPassword: jest.fn((_req, res) => res.status(200).json({ ok: "forgot" })),
	resetPassword: jest.fn((_req, res) => res.status(200).json({ ok: "reset" })),
	updateFocusGroup: jest.fn((_req, res) => res.status(200).json({ ok: "focus" })),
}));

jest.mock("../../middleware/auth.middleware", () => ({
	requireAuth: (_req: unknown, _res: unknown, next: () => void) => next(),
}));

import authRoutes from "../auth.routes";
import * as authController from "../../controllers/auth.controller";

const createApp = () => {
	const app = express();
	app.use(express.json());
	app.use("/auth", authRoutes);
	return app;
};

describe("auth routes", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("POST /auth/signup", async () => {
		const app = createApp();
		const res = await request(app).post("/auth/signup").send({});
		expect(res.status).toBe(201);
		expect(res.body).toEqual({ ok: "signup" });
		expect(authController.signup).toHaveBeenCalled();
	});

	it("POST /auth/login", async () => {
		const app = createApp();
		const res = await request(app).post("/auth/login").send({});
		expect(res.status).toBe(200);
		expect(res.body).toEqual({ ok: "login" });
		expect(authController.login).toHaveBeenCalled();
	});

	it("GET /auth/me", async () => {
		const app = createApp();
		const res = await request(app).get("/auth/me");
		expect(res.status).toBe(200);
		expect(res.body).toEqual({ ok: "me" });
		expect(authController.getMe).toHaveBeenCalled();
	});

	it("POST /auth/logout", async () => {
		const app = createApp();
		const res = await request(app).post("/auth/logout");
		expect(res.status).toBe(200);
		expect(res.body).toEqual({ ok: "logout" });
		expect(authController.logout).toHaveBeenCalled();
	});

	it("POST /auth/forgot-password", async () => {
		const app = createApp();
		const res = await request(app).post("/auth/forgot-password");
		expect(res.status).toBe(200);
		expect(res.body).toEqual({ ok: "forgot" });
		expect(authController.forgotPassword).toHaveBeenCalled();
	});

	it("POST /auth/reset-password/:token", async () => {
		const app = createApp();
		const res = await request(app).post("/auth/reset-password/token123");
		expect(res.status).toBe(200);
		expect(res.body).toEqual({ ok: "reset" });
		expect(authController.resetPassword).toHaveBeenCalled();
	});

	it("POST /auth/focus-group", async () => {
		const app = createApp();
		const res = await request(app).post("/auth/focus-group");
		expect(res.status).toBe(200);
		expect(res.body).toEqual({ ok: "focus" });
		expect(authController.updateFocusGroup).toHaveBeenCalled();
	});
});
