import { act, render, screen } from "@testing-library/react";
import { OfflineDetector } from "../OfflineDetector";

jest.mock("@/components/ui/ConnectionLost", () => ({
	ConnectionLost: () => <div data-testid="connection-lost">Offline</div>,
}));

describe("OfflineDetector", () => {
	const originalNavigatorOnLine = Object.getOwnPropertyDescriptor(
		window.navigator,
		"onLine",
	);

	beforeEach(() => {
		jest.resetAllMocks();
	});

	afterEach(() => {
		// Restore original navigator.onLine
		if (originalNavigatorOnLine) {
			Object.defineProperty(
				window.navigator,
				"onLine",
				originalNavigatorOnLine,
			);
		}
	});

	function setNavigatorOnLine(value: boolean) {
		Object.defineProperty(window.navigator, "onLine", {
			configurable: true,
			get: () => value,
		});
	}

	it("renders nothing when online", () => {
		setNavigatorOnLine(true);
		render(<OfflineDetector />);
		expect(screen.queryByTestId("connection-lost")).toBeNull();
	});

	it("renders ConnectionLost when offline", () => {
		setNavigatorOnLine(false);
		render(<OfflineDetector />);
		expect(screen.getByTestId("connection-lost")).toBeInTheDocument();
	});

	it("shows ConnectionLost when going offline", () => {
		setNavigatorOnLine(true);
		render(<OfflineDetector />);
		expect(screen.queryByTestId("connection-lost")).toBeNull();

		act(() => {
			setNavigatorOnLine(false);
			window.dispatchEvent(new Event("offline"));
		});

		expect(screen.getByTestId("connection-lost")).toBeInTheDocument();
	});

	it("hides ConnectionLost when going back online", () => {
		setNavigatorOnLine(false);
		render(<OfflineDetector />);
		expect(screen.getByTestId("connection-lost")).toBeInTheDocument();

		act(() => {
			setNavigatorOnLine(true);
			window.dispatchEvent(new Event("online"));
		});

		expect(screen.queryByTestId("connection-lost")).toBeNull();
	});
});
