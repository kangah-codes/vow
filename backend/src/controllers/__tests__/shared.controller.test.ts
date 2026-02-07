import type { Response } from "express";
import { getSharedConversation } from "../shared.controller";
import { Profile } from "../../models/profile.model";
import { Conversation } from "../../models/conversation.model";

jest.mock("../../models/profile.model", () => ({
	Profile: {
		findOne: jest.fn(),
	},
}));

jest.mock("../../models/conversation.model", () => ({
	Conversation: {
		findOne: jest.fn(),
	},
}));

const mockRes = () => {
	const res = {
		status: jest.fn(),
		json: jest.fn(),
	} as unknown as Response;
	(res.status as jest.Mock).mockReturnValue(res);
	return res as Response & { status: jest.Mock; json: jest.Mock };
};

describe("getSharedConversation", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("returns 404 when access code invalid", async () => {
		const req = { params: { accessCode: "CODE" } } as any;
		const res = mockRes();

		(Profile.findOne as jest.Mock).mockReturnValue({
			select: jest.fn().mockResolvedValue(null),
		});

		await getSharedConversation(req, res);

		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.json).toHaveBeenCalledWith({
			success: false,
			error: "Invalid access code",
		});
	});

	it("returns 410 when access code expired", async () => {
		const req = { params: { accessCode: "CODE" } } as any;
		const res = mockRes();

		const profile = {
			_id: "profile-id",
			accessCodeExpiresAt: new Date("2000-01-01T00:00:00.000Z"),
		};
		(Profile.findOne as jest.Mock).mockReturnValue({
			select: jest.fn().mockResolvedValue(profile),
		});

		await getSharedConversation(req, res);

		expect(res.status).toHaveBeenCalledWith(410);
		expect(res.json).toHaveBeenCalledWith({
			success: false,
			error: "Access code has expired",
		});
	});

	it("returns 404 when conversation not found", async () => {
		const req = { params: { accessCode: "CODE" } } as any;
		const res = mockRes();

		const profile = {
			_id: "profile-id",
			accessCodeExpiresAt: new Date("2999-01-01T00:00:00.000Z"),
		};
		(Profile.findOne as jest.Mock).mockReturnValue({
			select: jest.fn().mockResolvedValue(profile),
		});
		(Conversation.findOne as jest.Mock).mockReturnValue({
			select: jest.fn().mockResolvedValue(null),
		});

		await getSharedConversation(req, res);

		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.json).toHaveBeenCalledWith({
			success: false,
			error: "Conversation not found",
		});
	});

	it("returns shared conversation and profile", async () => {
		const req = { params: { accessCode: "CODE" } } as any;
		const res = mockRes();

		const profile = {
			_id: "profile-id",
			accessCodeExpiresAt: new Date("2999-01-01T00:00:00.000Z"),
			studentName: "Student",
		};
		const conversation = { _id: "conv-id" };

		(Profile.findOne as jest.Mock).mockReturnValue({
			select: jest.fn().mockResolvedValue(profile),
		});
		(Conversation.findOne as jest.Mock).mockReturnValue({
			select: jest.fn().mockResolvedValue(conversation),
		});

		await getSharedConversation(req, res);

		expect(res.json).toHaveBeenCalledWith({
			success: true,
			data: {
				conversation,
				profile,
			},
		});
	});

	it("returns 500 on unexpected error", async () => {
		const req = { params: { accessCode: "CODE" } } as any;
		const res = mockRes();

		(Profile.findOne as jest.Mock).mockImplementation(() => {
			throw new Error("db");
		});

		await getSharedConversation(req, res);

		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.json).toHaveBeenCalledWith({
			success: false,
			error: "Failed to fetch shared conversation",
		});
	});
});
