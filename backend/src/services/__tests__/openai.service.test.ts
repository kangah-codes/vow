describe("openai.service", () => {
	beforeEach(() => {
		jest.resetModules();
	});

	it("creates OpenAI client with Anthropic base URL", async () => {
		const OpenAIMock = jest.fn().mockImplementation(() => ({}));
		jest.doMock("openai", () => ({
			__esModule: true,
			default: OpenAIMock,
		}));
		jest.doMock("../../config/env", () => ({
			env: { ANTHROPIC_API_KEY: "key" },
		}));

		const module = await import("../openai.service");

		expect(OpenAIMock).toHaveBeenCalledWith({
			apiKey: "key",
			baseURL: "https://api.anthropic.com/v1/",
		});
		expect(module.openai).toBeDefined();
	});
});
