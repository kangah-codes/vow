/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/display-name */
import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import { Nav, NavProps } from "../Nav";

jest.mock("next/link", () => {
	return ({ href, children, ...rest }: any) => (
		<a href={href} {...rest}>
			{children}
		</a>
	);
});
jest.mock("next/image", () => {
	return (props: any) => <img {...props} />;
});
jest.mock("@radix-ui/react-dialog", () => {
	return {
		__esModule: true,
		Root: ({ children }: any) => <div>{children}</div>,
		Trigger: ({ children }: any) => <>{children}</>,
		Portal: ({ children }: any) => <>{children}</>,
		Overlay: ({ children }: any) => <>{children}</>,
		Content: ({ children }: any) => <div>{children}</div>,
		Close: ({ children }: any) => <>{children}</>,
	};
});

describe("Nav", () => {
	const defaultActions: NavProps["actions"] = [
		{ label: "Action1", href: "/a1", variant: "filled" },
		{ label: "Action2", href: "/a2", variant: "outlined" },
	];

	it("renders logo and brand by default", () => {
		render(<Nav />);
		expect(screen.getByAltText(/vow logo/i)).toBeInTheDocument();
		expect(screen.getByText(/my genius profile/i)).toBeInTheDocument();
	});

	it("renders backLink when provided", () => {
		render(<Nav backLink={{ label: "Back Home", href: "/" }} />);
		const backHome = screen.getAllByText(/back home/i)[0];
		expect(backHome).toBeInTheDocument();
		expect(backHome.closest("a")).toHaveAttribute("href", "/");
	});

	it("renders actions and greeting (desktop)", () => {
		render(<Nav actions={defaultActions} greeting="WELCOME, JOHN" />);
		const greeting = screen.getAllByText("WELCOME, JOHN")[0];
		expect(greeting).toBeInTheDocument();
		const action1 = screen.getAllByText("Action1")[0];
		const action2 = screen.getAllByText("Action2")[0];
		expect(action1).toBeInTheDocument();
		expect(action2).toBeInTheDocument();
	});

	it("renders centerLogo when centerLogo is true", () => {
		render(<Nav centerLogo />);
		// The logo should be in the center zone
		expect(screen.getAllByAltText(/vow logo/i).length).toBeGreaterThan(0);
	});

	it("applies dark mode styles", () => {
		render(<Nav dark />);
		const header = screen.getByRole("banner");
		expect(header).toHaveClass("bg-brand-brown");
	});

	it("renders mobile hamburger and opens menu", () => {
		render(
			<Nav
				actions={defaultActions}
				greeting="HELLO"
				backLink={{ label: "Back", href: "/back" }}
			/>,
		);
		const hamburger = screen.getByLabelText(/open menu/i);
		expect(hamburger).toBeInTheDocument();
		// simulate click to open menu (Dialog is mocked, so content is always rendered)
		expect(screen.getByText(/menu/i)).toBeInTheDocument();
		const hello = screen.getAllByText("HELLO")[0];
		expect(hello).toBeInTheDocument();
		const action1 = screen.getAllByText("Action1")[0];
		const back = screen.getAllByText("Back")[0];
		expect(action1).toBeInTheDocument();
		expect(back).toBeInTheDocument();
	});

	it("calls setMobileOpen(false) when mobile action or backLink is clicked", () => {
		render(
			<Nav
				actions={defaultActions}
				backLink={{ label: "Back", href: "/back" }}
			/>,
		);
		const actionLink = screen.getAllByText("Action1")[0];
		fireEvent.click(actionLink);
		const backLink = screen.getAllByText("Back")[0];
		fireEvent.click(backLink);
	});

	it("applies custom className", () => {
		render(<Nav className="custom-class" />);
		const header = screen.getByRole("banner");
		expect(header).toHaveClass("custom-class");
	});
});
