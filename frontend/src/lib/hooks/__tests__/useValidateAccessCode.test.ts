import { renderHook, act, waitFor } from "@testing-library/react";
import { useValidateAccessCode } from "../useValidateAccessCode";

let pushMock: jest.Mock;
let fetchMock: jest.Mock;

jest.mock("next/navigation", () => ({
	useRouter: () => ({ push: pushMock }),
}));

describe("useValidateAccessCode", () => {
	beforeEach(() => {
		pushMock = jest.fn();
		fetchMock = jest.fn();
		global.fetch = fetchMock;
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	it("uppercases and trims code then navigates on success", async () => {
		fetchMock.mockResolvedValue({
			ok: true,
			status: 200,
			json: async () => ({ data: {} }),
		});

		const { result } = renderHook(() => useValidateAccessCode());

		await act(async () => {
			await result.current.validate("  ab12  ");
		});

		expect(fetchMock).toHaveBeenCalledWith(
			expect.stringContaining("/shared/AB12"),
		);
		expect(pushMock).toHaveBeenCalledWith("/shared/AB12");
	});

	it("shows expired message for 410 responses", async () => {
		fetchMock.mockResolvedValue({
			ok: false,
			status: 410,
			json: async () => ({ error: "Expired" }),
		});

		const { result } = renderHook(() => useValidateAccessCode());

		await act(async () => {
			await result.current.validate("code");
		});

		await waitFor(() =>
			expect(result.current.error).toBe("This access code has expired."),
		);
		expect(result.current.isValidating).toBe(false);
	});

	it("shows invalid message for 404 responses", async () => {
		fetchMock.mockResolvedValue({
			ok: false,
			status: 404,
			json: async () => ({ error: "Invalid" }),
		});

		const { result } = renderHook(() => useValidateAccessCode());

		await act(async () => {
			await result.current.validate("code");
		});

		await waitFor(() =>
			expect(result.current.error).toBe(
				"Invalid access code. Please check and try again.",
			),
		);
	});

	it("shows generic error on network failure", async () => {
		fetchMock.mockRejectedValue(new Error("network down"));

		const { result } = renderHook(() => useValidateAccessCode());

		await act(async () => {
			await result.current.validate("code");
		});

		await waitFor(() =>
			expect(result.current.error).toBe("Unable to connect. Please try again."),
		);
	});
});
