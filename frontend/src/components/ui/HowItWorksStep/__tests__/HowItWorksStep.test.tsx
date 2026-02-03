/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from "@testing-library/react";
import HowItWorksStep, { HowItWorksStepProps } from "../HowItWorksStep";

jest.mock("next/image", () => ({
	__esModule: true,
	default: (props: any) => {
		// eslint-disable-next-line jsx-a11y/alt-text
		return <img {...props} />;
	},
}));

const defaultProps: HowItWorksStepProps = {
	step: 2,
	description: "Test description",
	imageSrc: "/test-image.jpg",
	imageAlt: "Test image alt",
};

describe("HowItWorksStep", () => {
	it("renders the step number", () => {
		render(<HowItWorksStep {...defaultProps} />);
		expect(screen.getByText("2")).toBeInTheDocument();
	});

	it("renders the description", () => {
		render(<HowItWorksStep {...defaultProps} />);
		expect(screen.getByText("Test description")).toBeInTheDocument();
	});

	it("renders the image with correct src and alt", () => {
		render(<HowItWorksStep {...defaultProps} />);
		const img = screen.getByAltText("Test image alt") as HTMLImageElement;
		expect(img).toBeInTheDocument();
		expect(img.src).toContain("/test-image.jpg");
	});

	it("applies the custom className", () => {
		render(<HowItWorksStep {...defaultProps} className="custom-class" />);
		const container = screen.getByText("2").closest("div");
		expect(container?.parentElement).toHaveClass("custom-class");
	});
});
