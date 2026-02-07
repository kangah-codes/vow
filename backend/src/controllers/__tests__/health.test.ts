import type { Response } from "express";
import mongoose from "mongoose";
import { getHealth } from "../health.controller";

jest.mock("mongoose", () => ({
	connection: {
		readyState: 1,
	},
}));

const mockRes = () => {
	const res = {
		json: jest.fn(),
	} as unknown as Response;
	return res as Response & { json: jest.Mock };
};

describe("getHealth", () => {
	beforeEach(() => {
		jest.useFakeTimers();
	});

	afterEach(() => {
		jest.useRealTimers();
	});

	it("returns health status with mongodb connected", () => {
		const res = mockRes();
		jest.setSystemTime(new Date("2020-01-01T00:00:00.000Z"));
		(mongoose as unknown as { connection: { readyState: number } }).connection
			.readyState = 1;

		getHealth({} as any, res);

		expect(res.json).toHaveBeenCalledWith({
			success: true,
			data: {
				status: "ok",
				timestamp: "2020-01-01T00:00:00.000Z",
				mongodb: "connected",
			},
		});
	});

	it("returns health status with mongodb disconnected", () => {
		const res = mockRes();
		jest.setSystemTime(new Date("2020-01-02T00:00:00.000Z"));
		(mongoose as unknown as { connection: { readyState: number } }).connection
			.readyState = 0;

		getHealth({} as any, res);

		expect(res.json).toHaveBeenCalledWith({
			success: true,
			data: {
				status: "ok",
				timestamp: "2020-01-02T00:00:00.000Z",
				mongodb: "disconnected",
			},
		});
	});
});
