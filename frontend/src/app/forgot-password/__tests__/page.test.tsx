/* eslint-disable @typescript-eslint/no-explicit-any */
import "@testing-library/jest-dom";
import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ForgotPasswordPage from "../page";

const fetchMock = jest.fn();

jest.mock("next/link", () => ({
	__esModule: true,
	default: ({ href, children, ...rest }: any) => (
		<a href={href} {...rest}>
			{children}
		</a>
	),
}));
jest.mock("@/components/ui/Nav", () => ({
	Nav: () => <div data-testid="nav" />,
}));

describe("ForgotPasswordPage", () => {
	let consoleErrorSpy: jest.SpyInstance;

	beforeEach(() => {
		global.fetch = fetchMock;
		fetchMock.mockReset();
		consoleErrorSpy = jest.spyOn(console, "error").mockImplementation((...args) => {
			if (
				typeof args[0] === "string" &&
				(args[0].includes("not wrapped in act") ||
					args[0].includes("not configured to support act"))
			) {
				return;
			}
			return console.warn(...args);
		});
	});

	afterEach(() => {
		consoleErrorSpy?.mockRestore();
	});

	it("shows server error and re-enables submit", async () => {
		fetchMock.mockResolvedValue({
			ok: false,
			status: 400,
			json: async () => ({ error: "Email not found" }),
		});

		const user = userEvent.setup();
		render(<ForgotPasswordPage />);

		await user.type(screen.getByLabelText(/email/i), "user@example.com");
		await user.click(screen.getByRole("button", { name: /send reset link/i }));

		await waitFor(() =>
			expect(screen.getAllByText(/email not found/i)[0]).toBeInTheDocument(),
		);
		expect(
			screen.getByRole("button", { name: /send reset link/i }),
		).not.toBeDisabled();
	});

	it("shows success state after sending", async () => {
		fetchMock.mockResolvedValue({
			ok: true,
			status: 200,
			json: async () => ({}),
		});

		const user = userEvent.setup();
		render(<ForgotPasswordPage />);

		await act(async () => {
			await user.type(screen.getByLabelText(/email/i), "friend@example.com");
			await user.click(
				screen.getByRole("button", { name: /send reset link/i }),
			);
		});

		await waitFor(() =>
			expect(screen.getByText(/check your email/i)).toBeInTheDocument(),
		);
		expect(screen.getByText(/friend@example.com/i)).toBeInTheDocument();
	});

	it("disables submit while sending", async () => {
		// hold the promise to inspect disabled state
		let resolveFetch: () => void;
		fetchMock.mockReturnValue(
			new Promise((resolve) => {
				resolveFetch = () =>
					resolve({
						ok: true,
						status: 200,
						json: async () => ({}),
					});
			}),
		);

		const user = userEvent.setup();
		render(<ForgotPasswordPage />);

		await act(async () => {
			await user.type(screen.getByLabelText(/email/i), "busy@example.com");
			await user.click(
				screen.getByRole("button", { name: /send reset link/i }),
			);
		});

		expect(screen.getByRole("button", { name: /sending/i })).toBeDisabled();
		resolveFetch!();
	});
});
