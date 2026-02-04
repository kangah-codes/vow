import { render, screen } from "@testing-library/react";
import { ProfileProgress, ProfileSectionData } from "../ProfileProgress";

const sections: ProfileSectionData[] = [
	{
		title: "Personal Info",
		status: "complete",
		description: "Add your personal details.",
	},
	{
		title: "Education",
		status: "in-progress",
		description: "Fill in your education history.",
	},
	{
		title: "Skills",
		status: "not-started",
		description: "List your skills.",
	},
];

describe("ProfileProgress", () => {
	it("renders the student name in the heading", () => {
		render(
			<ProfileProgress
				studentName="Alice"
				percentComplete={50}
				sections={sections}
			/>,
		);
		expect(
			screen.getByRole("heading", { name: "Alice's Genius Summary" }),
		).toBeInTheDocument();
	});

	it("renders the progress bar with correct percent", () => {
		const { container } = render(
			<ProfileProgress
				studentName="Bob"
				percentComplete={75}
				sections={sections}
			/>,
		);
		expect(screen.getByText("75% Complete")).toBeInTheDocument();
		// Find the progress fill element by inline style (width: 75%)
		const progressFill = container.querySelector(
			'div[style*="width: 75%"], div[style*="width:75%"]',
		);
		expect(progressFill).toBeTruthy();
		expect(progressFill).toHaveStyle("width: 75%");
	});

	it("renders all section cards with correct titles and descriptions", () => {
		render(
			<ProfileProgress
				studentName="Charlie"
				percentComplete={30}
				sections={sections}
			/>,
		);
		sections.forEach((section) => {
			expect(screen.getByText(section.title)).toBeInTheDocument();
			if (section.description) {
				expect(screen.getByText(section.description)).toBeInTheDocument();
			}
		});
	});

	it("renders correct status badges for each section", () => {
		render(
			<ProfileProgress
				studentName="Dana"
				percentComplete={10}
				sections={sections}
			/>,
		);
		expect(screen.getByText("Complete")).toBeInTheDocument();
		expect(screen.getByText("In Progress")).toBeInTheDocument();
		expect(screen.getByText("Not Started")).toBeInTheDocument();
	});

	it("applies the correct className prop", () => {
		render(
			<ProfileProgress
				studentName="Eve"
				percentComplete={60}
				sections={sections}
				className="custom-class"
			/>,
		);
		expect(screen.getByText("Eve's Genius Summary").parentElement).toHaveClass(
			"custom-class",
		);
	});

	it("hides header and progress bar when hideHeader is true", () => {
		render(
			<ProfileProgress
				studentName="Frank"
				percentComplete={40}
				sections={sections}
				hideHeader={true}
			/>,
		);
		expect(
			screen.queryByRole("heading", { name: "Frank's Genius Summary" }),
		).not.toBeInTheDocument();
		expect(screen.queryByText("40% Complete")).not.toBeInTheDocument();
	});
});
