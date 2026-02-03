/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from "@testing-library/react";
import { ChatBubble, ChatBubbleProps } from "../ChatBubble";

jest.mock("next/image", () => ({
	__esModule: true,
	default: (props: any) => {
		// eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
		return <img {...props} />;
	},
}));

describe("ChatBubble", () => {
	const defaultProps: ChatBubbleProps = {
		sender: "user",
		senderName: "John Doe",
		message: "Hello, world!",
		timestamp: "10:30 AM",
	};

	it("renders message text", () => {
		render(<ChatBubble {...defaultProps} />);
		expect(screen.getByText("Hello, world!")).toBeInTheDocument();
	});

	it("renders sender name", () => {
		render(<ChatBubble {...defaultProps} />);
		expect(screen.getByText("John Doe")).toBeInTheDocument();
	});

	it("renders timestamp", () => {
		render(<ChatBubble {...defaultProps} />);
		expect(screen.getByText("10:30 AM")).toBeInTheDocument();
	});

	it("renders avatar with default src", () => {
		render(<ChatBubble {...defaultProps} />);
		const avatar = screen.getByAltText("John Doe avatar");
		expect(avatar).toHaveAttribute("src", "/vow-logo.svg");
	});

	it("renders avatar with custom src", () => {
		render(<ChatBubble {...defaultProps} avatarSrc="/custom-avatar.png" />);
		const avatar = screen.getByAltText("John Doe avatar");
		expect(avatar).toHaveAttribute("src", "/custom-avatar.png");
	});

	it("applies user-specific classes when sender is user", () => {
		const { container } = render(
			<ChatBubble {...defaultProps} sender="user" />,
		);
		const wrapper = container.firstChild as HTMLElement;
		expect(wrapper).toHaveClass("items-end");
	});

	it("applies ai-specific classes when sender is ai", () => {
		const { container } = render(<ChatBubble {...defaultProps} sender="ai" />);
		const wrapper = container.firstChild as HTMLElement;
		expect(wrapper).toHaveClass("items-start");
	});

	it("applies custom className", () => {
		const { container } = render(
			<ChatBubble {...defaultProps} className="custom-class" />,
		);
		const wrapper = container.firstChild as HTMLElement;
		expect(wrapper).toHaveClass("custom-class");
	});
});
