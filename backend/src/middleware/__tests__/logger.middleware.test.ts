import type { Response, NextFunction } from "express";
import { requestLogger } from "../logger.middleware";
import { logger } from "../../utils/logger";

jest.mock("../../utils/logger", () => ({
	logger: {
		info: jest.fn(),
	},
}));

describe("requestLogger", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("logs request method and path then calls next", () => {
		const req = { method: "GET", path: "/test" } as any;
		const res = {} as Response;
		const next = jest.fn() as NextFunction;

		requestLogger(req, res, next);

		expect(logger.info).toHaveBeenCalledWith("GET /test");
		expect(next).toHaveBeenCalled();
	});
});
