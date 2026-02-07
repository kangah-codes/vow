import type { Response } from "express";
import { getConversation } from "../conversation.controller";
import { Conversation } from "../../models/conversation.model";
import { Profile } from "../../models/profile.model";

jest.mock("../../models/conversation.model", () => ({
	Conversation: {
		findOne: jest.fn(),
	},
}));

jest.mock("../../models/profile.model", () => ({
	Profile: {
		findById: jest.fn(),
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

describe("getConversation", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("returns 404 when conversation not found", async () => {
		const req = { params: { id: "abc" }, userId: "user-id" } as any;
		const res = mockRes();

		(Conversation.findOne as jest.Mock).mockReturnValue({
			select: jest.fn().mockResolvedValue(null),
		});

		await getConversation(req, res);

		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.json).toHaveBeenCalledWith({
			success: false,
			error: "Conversation not found",
		});
	});

	it("returns conversation and profile on success", async () => {
		const req = { params: { id: "abc" }, userId: "user-id" } as any;
		const res = mockRes();

		const conversation = {
			_id: "abc",
			profileId: "profile-id",
			userId: "user-id",
		};
		const profile = {
			studentName: "Student",
			gradeLevel: "3",
			percentComplete: 50,
			status: "in-progress",
			sections: [],
			accessCode: "CODE",
		};

		(Conversation.findOne as jest.Mock).mockReturnValue({
			select: jest.fn().mockResolvedValue(conversation),
		});
		(Profile.findById as jest.Mock).mockReturnValue({
			select: jest.fn().mockResolvedValue(profile),
		});

		await getConversation(req, res);

		expect(Conversation.findOne).toHaveBeenCalledWith({
			_id: "abc",
			userId: "user-id",
		});
		expect(Profile.findById).toHaveBeenCalledWith("profile-id");
		expect(res.json).toHaveBeenCalledWith({
			success: true,
			data: {
				conversation,
				profile,
			},
		});
	});

	it("returns 404 when CastError thrown", async () => {
		const req = { params: { id: "bad-id" }, userId: "user-id" } as any;
		const res = mockRes();

		(Conversation.findOne as jest.Mock).mockImplementation(() => {
			throw { name: "CastError" };
		});

		await getConversation(req, res);

		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.json).toHaveBeenCalledWith({
			success: false,
			error: "Conversation not found",
		});
	});

	it("returns 500 on unexpected error", async () => {
		const req = { params: { id: "abc" }, userId: "user-id" } as any;
		const res = mockRes();

		(Conversation.findOne as jest.Mock).mockImplementation(() => {
			throw new Error("db");
		});

		await getConversation(req, res);

		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.json).toHaveBeenCalledWith({
			success: false,
			error: "Failed to fetch conversation",
		});
	});
});
