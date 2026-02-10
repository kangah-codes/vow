/* eslint-disable @typescript-eslint/no-require-imports */
const useConversationMock = jest.fn();
const getAccessTokenMock = jest.fn();
const notFoundMock = jest.fn();

jest.mock("next/navigation", () => ({
	useParams: () => ({ id: "123" }),
	useRouter: () => ({ push: jest.fn(), replace: jest.fn() }),
	notFound: () => notFoundMock(),
}));
jest.mock("@/lib/hooks/useConversation", () => ({
	useConversation: (...args: unknown[]) => useConversationMock(...args),
}));
jest.mock("@/lib/utils/cookies", () => ({
	getAccessToken: () => getAccessTokenMock(),
}));
jest.mock("@/components/ui/Nav", () => ({
	Nav: () => <div data-testid="nav" />,
}));
jest.mock("@/components/complete", () => ({
	DecorativeSwooshes: () => <div data-testid="swooshes" />,
}));
jest.mock("@/components/ui/ProfileProgress", () => ({
	ProfileProgress: () => <div data-testid="profile-progress" />,
}));
jest.mock("@/components/conversation", () => ({
	ChatPanel: () => <div data-testid="chat-panel" />,
	ConversationSkeleton: () => <div data-testid="skeleton" />,
	ProfileCompleteModal: () => <div data-testid="modal" />,
}));

import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import { ApiError } from "@/lib/utils/api";

describe("ConversationPage", () => {
	let originalEnv: NodeJS.ProcessEnv;
	let websocketMock: jest.Mock;
	let ConversationPage: React.ComponentType;

	beforeAll(() => {
		originalEnv = { ...process.env };
		process.env.NEXT_PUBLIC_WS_URL = "ws://example.test";
		ConversationPage = require("../[id]/page").default;
	});

	beforeEach(() => {
		process.env = { ...originalEnv };
		websocketMock = jest.fn().mockImplementation(() => ({
			send: jest.fn(),
			close: jest.fn(),
			readyState: 1,
		}));
		// @ts-expect-error override WebSocket
		global.WebSocket = websocketMock;
		getAccessTokenMock.mockReturnValue("token-123");
		notFoundMock.mockReset();
	});

	afterEach(() => {
		process.env = { ...originalEnv };
		jest.clearAllMocks();
	});

	it("uses NEXT_PUBLIC_WS_URL when provided", () => {
		useConversationMock.mockReturnValue({
			data: {
				conversation: { messages: [] },
				profile: {
					studentName: "Stu",
					percentComplete: 0,
					sections: [],
					status: "in-progress",
				},
			},
			isLoading: false,
			error: null,
		});

		render(<ConversationPage />);

		expect(websocketMock).toHaveBeenCalledWith("ws://example.test");
	});

	it("calls notFound on 404 error", () => {
		useConversationMock.mockReturnValue({
			data: undefined,
			isLoading: false,
			error: new ApiError(404, "Missing"),
		});
		notFoundMock.mockImplementation(() => {
			throw new Error("notfound");
		});

		expect(() => render(<ConversationPage />)).toThrow("notfound");
		expect(notFoundMock).toHaveBeenCalled();
	});
});
