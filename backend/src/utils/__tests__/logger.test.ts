import { logger } from "../logger";

describe("logger", () => {
	beforeEach(() => {
		jest.useFakeTimers();
		jest.setSystemTime(new Date("2020-01-01T00:00:00.000Z"));
	});

	afterEach(() => {
		jest.useRealTimers();
		jest.restoreAllMocks();
	});

	it("logs info with timestamp", () => {
		const spy = jest.spyOn(console, "log").mockImplementation(() => undefined);

		logger.info("hello");

		expect(spy).toHaveBeenCalledWith(
			"[2020-01-01T00:00:00.000Z] INFO:",
			"hello",
		);
	});

	it("logs warn with timestamp", () => {
		const spy = jest
			.spyOn(console, "warn")
			.mockImplementation(() => undefined);

		logger.warn("warn");

		expect(spy).toHaveBeenCalledWith(
			"[2020-01-01T00:00:00.000Z] WARN:",
			"warn",
		);
	});

	it("logs error with timestamp", () => {
		const spy = jest
			.spyOn(console, "error")
			.mockImplementation(() => undefined);

		logger.error("error");

		expect(spy).toHaveBeenCalledWith(
			"[2020-01-01T00:00:00.000Z] ERROR:",
			"error",
		);
	});

	it("logs debug only in development", () => {
		process.env.NODE_ENV = "development";
		const spy = jest
			.spyOn(console, "debug")
			.mockImplementation(() => undefined);

		logger.debug("debug");

		expect(spy).toHaveBeenCalledWith(
			"[2020-01-01T00:00:00.000Z] DEBUG:",
			"debug",
		);
	});

	it("skips debug in production", () => {
		process.env.NODE_ENV = "production";
		const spy = jest
			.spyOn(console, "debug")
			.mockImplementation(() => undefined);

		logger.debug("debug");

		expect(spy).not.toHaveBeenCalled();
	});
});
