import type { Response, NextFunction } from "express";
import { errorHandler } from "../error.middleware";
import { logger } from "../../utils/logger";

jest.mock("../../utils/logger", () => ({
	logger: {
		error: jest.fn(),
	},
}));

const mockRes = () => {
	const res = {
		status: jest.fn(),
		json: jest.fn(),
	} as unknown as Response;
	(res.status as jest.Mock).mockReturnValue(res);
	return res as Response & { status: jest.Mock; json: jest.Mock };
};

describe("errorHandler", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("returns error message in non-production", () => {
		const res = mockRes();
		const next = jest.fn() as NextFunction;
		process.env.NODE_ENV = "development";

		errorHandler(new Error("boom"), {} as any, res, next);

		expect(logger.error).toHaveBeenCalledWith("Unhandled error:", "boom");
		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.json).toHaveBeenCalledWith({
			success: false,
			error: "boom",
		});
	});

	it("returns generic message in production", () => {
		const res = mockRes();
		const next = jest.fn() as NextFunction;
		process.env.NODE_ENV = "production";

		errorHandler(new Error("boom"), {} as any, res, next);

		expect(res.json).toHaveBeenCalledWith({
			success: false,
			error: "Internal server error",
		});
	});
});
