import { fireEvent, render } from "@testing-library/react";
import { ChatInput, ChatInputProps } from "../ChatInput";

describe("ChatInput", () => {
	const setup = (props?: Partial<ChatInputProps>) => {
		const defaultProps: ChatInputProps = {
			value: "",
			onChange: jest.fn(),
			onSend: jest.fn(),
			placeholder: "Type your message here...",
			className: "",
		};
		return render(<ChatInput {...defaultProps} {...props} />);
	};

	it("renders input and button", () => {
		const { getByPlaceholderText, getByRole } = setup();
		expect(
			getByPlaceholderText("Type your message here..."),
		).toBeInTheDocument();
		expect(getByRole("button", { name: /send/i })).toBeInTheDocument();
	});

	it("calls onChange when input value changes", () => {
		const onChange = jest.fn();
		const { getByPlaceholderText } = setup({ onChange });
		const input = getByPlaceholderText(
			"Type your message here...",
		) as HTMLInputElement;
		fireEvent.change(input, { target: { value: "hello" } });
		expect(onChange).toHaveBeenCalledWith("hello");
	});

	it("calls onSend when button is clicked and value is not empty", () => {
		const onSend = jest.fn();
		const { getByRole } = setup({ value: "hello", onSend });
		const button = getByRole("button", { name: /send/i });
		fireEvent.click(button);
		expect(onSend).toHaveBeenCalled();
	});

	it("does not call onSend when button is clicked and value is empty", () => {
		const onSend = jest.fn();
		const { getByRole } = setup({ value: "", onSend });
		const button = getByRole("button", { name: /send/i });
		fireEvent.click(button);
		expect(onSend).not.toHaveBeenCalled();
	});

	it("calls onSend when Enter is pressed and value is not empty", () => {
		const onSend = jest.fn();
		const { getByPlaceholderText } = setup({ value: "hello", onSend });
		const input = getByPlaceholderText(
			"Type your message here...",
		) as HTMLInputElement;
		fireEvent.keyDown(input, { key: "Enter", shiftKey: false });
		expect(onSend).toHaveBeenCalled();
	});

	it("does not call onSend when Enter is pressed and value is empty", () => {
		const onSend = jest.fn();
		const { getByPlaceholderText } = setup({ value: "", onSend });
		const input = getByPlaceholderText(
			"Type your message here...",
		) as HTMLInputElement;
		fireEvent.keyDown(input, { key: "Enter", shiftKey: false });
		expect(onSend).not.toHaveBeenCalled();
	});

	it("does not call onSend when Shift+Enter is pressed", () => {
		const onSend = jest.fn();
		const { getByPlaceholderText } = setup({ value: "hello", onSend });
		const input = getByPlaceholderText(
			"Type your message here...",
		) as HTMLInputElement;
		fireEvent.keyDown(input, { key: "Enter", shiftKey: true });
		expect(onSend).not.toHaveBeenCalled();
	});

	it("renders with custom placeholder", () => {
		const { getByPlaceholderText } = setup({ placeholder: "Say something..." });
		expect(getByPlaceholderText("Say something...")).toBeInTheDocument();
	});

	it("applies custom className", () => {
		const { container } = setup({ className: "custom-class" });
		expect(container.firstChild).toHaveClass("custom-class");
	});
});
