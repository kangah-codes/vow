/* eslint-disable @typescript-eslint/no-explicit-any */
import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PasswordResetPage from "../[token]/page";

const fetchMock = jest.fn();

jest.mock("next/navigation", () => ({
	useParams: () => ({ token: "reset-token" }),
}));
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

describe("PasswordResetPage", () => {
	beforeEach(() => {
		global.fetch = fetchMock;
		fetchMock.mockReset();
	});

	it("validates minimum length", async () => {
		const user = userEvent.setup();
		render(<PasswordResetPage />);

		const newPassword = screen.getByLabelText("New password");
		const confirmPassword = screen.getByLabelText("Confirm new password");

		await user.type(newPassword, "short");
		await user.type(confirmPassword, "short");
		await user.click(screen.getByRole("button", { name: /reset password/i }));

		expect(
			screen.getAllByText(/password must be at least 8 characters/i)[0],
		).toBeInTheDocument();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it("validates matching passwords", async () => {
		const user = userEvent.setup();
		render(<PasswordResetPage />);

		const newPassword = screen.getByLabelText("New password");
		const confirmPassword = screen.getByLabelText("Confirm new password");

		await user.type(newPassword, "password123");
		await user.type(confirmPassword, "different123");
		await user.click(screen.getByRole("button", { name: /reset password/i }));

		expect(
			screen.getAllByText(/passwords do not match/i)[0],
		).toBeInTheDocument();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it("shows server error and re-enables button", async () => {
		fetchMock.mockResolvedValue({
			ok: false,
			status: 400,
			json: async () => ({ error: "Token invalid" }),
		});

		const user = userEvent.setup();
		render(<PasswordResetPage />);

		const newPassword = screen.getByLabelText("New password");
		const confirmPassword = screen.getByLabelText("Confirm new password");

		await user.type(newPassword, "password123");
		await user.type(confirmPassword, "password123");
		await user.click(screen.getByRole("button", { name: /reset password/i }));

		await waitFor(() =>
			expect(screen.getAllByText(/token invalid/i)[0]).toBeInTheDocument(),
		);
		expect(
			screen.getByRole("button", { name: /reset password/i }),
		).not.toBeDisabled();
	});

	it("shows success message when password resets", async () => {
		fetchMock.mockResolvedValue({
			ok: true,
			status: 200,
			json: async () => ({}),
		});

		const user = userEvent.setup();
		render(<PasswordResetPage />);

		const newPassword = screen.getByLabelText("New password");
		const confirmPassword = screen.getByLabelText("Confirm new password");

		await user.type(newPassword, "password123");
		await user.type(confirmPassword, "password123");
		await user.click(screen.getByRole("button", { name: /reset password/i }));

		await waitFor(() =>
			expect(screen.getByText(/password reset/i)).toBeInTheDocument(),
		);
		expect(
			screen.getByRole("link", { name: /go to login/i }),
		).toBeInTheDocument();
	});
});
