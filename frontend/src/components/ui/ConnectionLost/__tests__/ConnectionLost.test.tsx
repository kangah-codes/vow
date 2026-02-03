/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/display-name */
import { fireEvent, render, screen } from "@testing-library/react";
import ConnectionLost from "../ConnectionLost";

jest.mock("next/link", () => {
	return ({ href, children, ...rest }: any) => (
		<a href={href} {...rest}>
			{children}
		</a>
	);
});

jest.mock("../../Nav", () => ({
	Nav: () => <nav data-testid="nav" />,
}));

describe("ConnectionLost", () => {
	it("renders the main elements", () => {
		render(<ConnectionLost />);
		expect(screen.getByText("Connection Lost")).toBeInTheDocument();
		expect(
			screen.getByText(
				"We're having trouble connecting to our servers. Don't worry – your conversation has been saved.",
			),
		).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: /try again/i }),
		).toBeInTheDocument();
		expect(
			screen.getByRole("link", { name: /go to dashboard/i }),
		).toHaveAttribute("href", "/dashboard");
		expect(screen.getByTestId("nav")).toBeInTheDocument();
	});

	it("renders the help action in Nav", () => {
		render(<ConnectionLost />);
		// Nav is mocked, so just check it's present
		expect(screen.getByTestId("nav")).toBeInTheDocument();
	});

	it("renders the troubleshooting steps", () => {
		render(<ConnectionLost />);
		expect(screen.getByText("Troubleshooting Steps:")).toBeInTheDocument();
		expect(
			screen.getByText("Check your internet connection"),
		).toBeInTheDocument();
		expect(
			screen.getByText("Try refreshing the page (button above)"),
		).toBeInTheDocument();
		expect(
			screen.getByText("Clear your browser cache and cookies"),
		).toBeInTheDocument();
		expect(screen.getByText("Try a different browser")).toBeInTheDocument();
		expect(screen.getByText("contact support")).toHaveAttribute(
			"href",
			"/contact",
		);
	});

	it("calls onRetry when Try Again is clicked", () => {
		const onRetry = jest.fn();
		render(<ConnectionLost onRetry={onRetry} />);
		fireEvent.click(screen.getByRole("button", { name: /try again/i }));
		expect(onRetry).toHaveBeenCalled();
	});

	it("renders the 'What this means' section", () => {
		render(<ConnectionLost />);
		expect(screen.getByText("What this means:")).toBeInTheDocument();
		expect(
			screen.getByText("Your progress has been automatically saved"),
		).toBeInTheDocument();
		expect(
			screen.getByText("You can return using your access code"),
		).toBeInTheDocument();
		expect(screen.getByText("No data has been lost")).toBeInTheDocument();
	});
});
