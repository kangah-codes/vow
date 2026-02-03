import { render, screen } from "@testing-library/react";
import { ActionCard } from "../ActionCard";

describe("ActionCard", () => {
	it("renders the title and description", () => {
		render(
			<ActionCard
				title="Test Title"
				description="Test description"
				buttonLabel="Click Me"
				buttonHref="/test"
			/>,
		);

		expect(screen.getByText("Test Title")).toBeInTheDocument();
		expect(screen.getByText("Test description")).toBeInTheDocument();
		expect(screen.getByText("Click Me")).toBeInTheDocument();
	});

	it("renders a link when buttonHref is provided", () => {
		render(
			<ActionCard
				title="Test Title"
				description="Test description"
				buttonLabel="Click Me"
				buttonHref="/test-link"
			/>,
		);

		const button = screen.getByText("Click Me");
		expect(button.closest("a")).toHaveAttribute("href", "/test-link");
	});
});
