import type { Response, NextFunction } from "express";
import passport from "../../config/passport";
import { requireAuth } from "../auth.middleware";

jest.mock("../../config/passport", () => ({
	authenticate: jest.fn(),
}));

const mockRes = () => {
	const res = {
		status: jest.fn(),
		json: jest.fn(),
	} as unknown as Response;
	(res.status as jest.Mock).mockReturnValue(res);
	return res as Response & { status: jest.Mock; json: jest.Mock };
};

describe("requireAuth", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("sets userId and calls next on success", () => {
		const req = { headers: {} } as any;
		const res = mockRes();
		const next = jest.fn() as NextFunction;

		(passport.authenticate as jest.Mock).mockImplementation(
			(_strategy: string, _opts: object, cb: Function) =>
				(_req: unknown, _res: unknown, _next: NextFunction) =>
					cb(null, { userId: "user-1" }),
		);

		requireAuth(req, res, next);

		expect(req.userId).toBe("user-1");
		expect(next).toHaveBeenCalled();
	});

	it("returns 401 on auth error", () => {
		const req = { headers: {} } as any;
		const res = mockRes();
		const next = jest.fn() as NextFunction;

		(passport.authenticate as jest.Mock).mockImplementation(
			(_strategy: string, _opts: object, cb: Function) =>
				() => cb(new Error("bad"), false),
		);

		requireAuth(req, res, next);

		expect(res.status).toHaveBeenCalledWith(401);
		expect(res.json).toHaveBeenCalledWith({
			success: false,
			error: "Invalid or expired token",
		});
	});

	it("returns 401 when missing bearer token", () => {
		const req = { headers: {} } as any;
		const res = mockRes();
		const next = jest.fn() as NextFunction;

		(passport.authenticate as jest.Mock).mockImplementation(
			(_strategy: string, _opts: object, cb: Function) =>
				() => cb(null, false),
		);

		requireAuth(req, res, next);

		expect(res.status).toHaveBeenCalledWith(401);
		expect(res.json).toHaveBeenCalledWith({
			success: false,
			error: "You must be signed in to perform this action",
		});
	});

	it("returns 401 when bearer token invalid", () => {
		const req = { headers: { authorization: "Bearer bad" } } as any;
		const res = mockRes();
		const next = jest.fn() as NextFunction;

		(passport.authenticate as jest.Mock).mockImplementation(
			(_strategy: string, _opts: object, cb: Function) =>
				() => cb(null, false),
		);

		requireAuth(req, res, next);

		expect(res.status).toHaveBeenCalledWith(401);
		expect(res.json).toHaveBeenCalledWith({
			success: false,
			error: "Invalid or expired token",
		});
	});
});
