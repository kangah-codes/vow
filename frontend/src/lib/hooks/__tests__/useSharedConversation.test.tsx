/* eslint-disable react/display-name */
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { ApiError } from "@/lib/utils/api";
import { useSharedConversation } from "../useSharedConversation";

const createWrapper =
	(client: QueryClient) =>
	({ children }: { children: React.ReactNode }) => (
		<QueryClientProvider client={client}>{children}</QueryClientProvider>
	);

describe("useSharedConversation", () => {
	let fetchMock: jest.Mock;

	beforeEach(() => {
		fetchMock = jest.fn();
		global.fetch = fetchMock;
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	it("returns shared conversation data", async () => {
		fetchMock.mockResolvedValue({
			ok: true,
			status: 200,
			json: async () => ({
				data: { conversation: { id: "1" }, profile: { id: "p1" } },
			}),
		});
		const client = new QueryClient({
			defaultOptions: { queries: { retry: false } },
		});

		const { result } = renderHook(() => useSharedConversation("ABC"), {
			wrapper: createWrapper(client),
		});

		await waitFor(() =>
			expect(result.current.data).toEqual({
				conversation: { id: "1" },
				profile: { id: "p1" },
			}),
		);
	});

	it("surface ApiError on failed fetch", async () => {
		fetchMock.mockResolvedValue({
			ok: false,
			status: 404,
			json: async () => ({ error: "Not found" }),
		});
		const client = new QueryClient({
			defaultOptions: { queries: { retry: false } },
		});

		const { result } = renderHook(() => useSharedConversation("MISSING"), {
			wrapper: createWrapper(client),
		});

		await waitFor(() => expect(result.current.error).toBeInstanceOf(ApiError));
		expect((result.current.error as ApiError).status).toBe(404);
	});
});
