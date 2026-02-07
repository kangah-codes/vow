import type { Response } from "express";
import { createProfile, deleteProfile, getProfiles } from "../profile.controller";
import { Profile } from "../../models/profile.model";
import { Conversation } from "../../models/conversation.model";
import { User } from "../../models/user.model";

jest.mock("../../models/profile.model", () => ({
	Profile: {
		find: jest.fn(),
		create: jest.fn(),
		findOne: jest.fn(),
		deleteOne: jest.fn(),
	},
}));

jest.mock("../../models/conversation.model", () => ({
	Conversation: {
		findOne: jest.fn(),
		create: jest.fn(),
		deleteMany: jest.fn(),
	},
}));

jest.mock("../../models/user.model", () => ({
	User: {
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

describe("profile.controller", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe("getProfiles", () => {
		it("returns profiles with conversation ids", async () => {
			const req = { userId: "user-id" } as any;
			const res = mockRes();

			const profileA = {
				_id: "profile-a",
				toObject: () => ({ _id: "profile-a", studentName: "A" }),
			};
			const profileB = {
				_id: "profile-b",
				toObject: () => ({ _id: "profile-b", studentName: "B" }),
			};

			(Profile.find as jest.Mock).mockReturnValue({
				select: jest.fn().mockReturnValue({
					sort: jest.fn().mockResolvedValue([profileA, profileB]),
				}),
			});

			(Conversation.findOne as jest.Mock)
				.mockReturnValueOnce({ select: jest.fn().mockResolvedValue({ _id: "c1" }) })
				.mockReturnValueOnce({ select: jest.fn().mockResolvedValue(null) });

			await getProfiles(req, res);

			expect(Profile.find).toHaveBeenCalledWith({ userId: "user-id" });
			expect(res.json).toHaveBeenCalledWith({
				success: true,
				data: [
					{ _id: "profile-a", studentName: "A", conversationId: "c1" },
					{ _id: "profile-b", studentName: "B", conversationId: undefined },
				],
			});
		});

		it("returns 500 on error", async () => {
			const req = { userId: "user-id" } as any;
			const res = mockRes();

			(Profile.find as jest.Mock).mockImplementation(() => {
				throw new Error("db");
			});

			await getProfiles(req, res);

			expect(res.status).toHaveBeenCalledWith(500);
			expect(res.json).toHaveBeenCalledWith({
				success: false,
				error: "Failed to fetch profiles",
			});
		});
	});

	describe("createProfile", () => {
		it("returns 400 on validation error", async () => {
			const req = { body: {}, userId: "user-id" } as any;
			const res = mockRes();

			await createProfile(req, res);

			expect(res.status).toHaveBeenCalledWith(400);
		});

		it("returns 404 when user not found", async () => {
			const req = {
				body: {
					studentName: "Student",
					gradeLevel: "3",
					relationship: "parent",
				},
				userId: "user-id",
			} as any;
			const res = mockRes();

			(User.findById as jest.Mock).mockResolvedValue(null);

			await createProfile(req, res);

			expect(res.status).toHaveBeenCalledWith(404);
			expect(res.json).toHaveBeenCalledWith({
				success: false,
				error: "User not found",
			});
		});

		it("creates profile and conversation", async () => {
			const req = {
				body: {
					studentName: "Student",
					gradeLevel: "3",
					relationship: "parent",
					age: 9,
					school: "School",
				},
				userId: "user-id",
			} as any;
			const res = mockRes();

			(User.findById as jest.Mock).mockResolvedValue({ email: "test@example.com" });
			const profile = {
				_id: "profile-id",
				studentName: "Student",
				accessCode: "ABCD-1234",
				status: "in-progress",
			};
			(Profile.create as jest.Mock).mockResolvedValue(profile);
			(Conversation.create as jest.Mock).mockResolvedValue({ _id: "conv-id" });
			const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => undefined);

			await createProfile(req, res);

			expect(Profile.create).toHaveBeenCalledWith(
				expect.objectContaining({
					userId: "user-id",
					studentName: "Student",
					gradeLevel: "3",
					relationship: "parent",
				}),
			);
			expect(Conversation.create).toHaveBeenCalledWith(
				expect.objectContaining({
					profileId: "profile-id",
					userId: "user-id",
					currentSection: "Interest Awareness",
				}),
			);
			expect(res.status).toHaveBeenCalledWith(201);
			expect(res.json).toHaveBeenCalledWith({
				success: true,
				data: {
					profile: {
						id: "profile-id",
						studentName: "Student",
						accessCode: "ABCD-1234",
						status: "in-progress",
					},
					conversationId: "conv-id",
				},
			});
			consoleSpy.mockRestore();
		});

		it("returns 500 on error", async () => {
			const req = {
				body: {
					studentName: "Student",
					gradeLevel: "3",
					relationship: "parent",
				},
				userId: "user-id",
			} as any;
			const res = mockRes();

			(User.findById as jest.Mock).mockRejectedValue(new Error("db"));

			await createProfile(req, res);

			expect(res.status).toHaveBeenCalledWith(500);
			expect(res.json).toHaveBeenCalledWith({
				success: false,
				error: "Failed to create profile",
			});
		});
	});

	describe("deleteProfile", () => {
		it("returns 404 when profile not found", async () => {
			const req = { params: { id: "id" }, userId: "user-id" } as any;
			const res = mockRes();

			(Profile.findOne as jest.Mock).mockResolvedValue(null);

			await deleteProfile(req, res);

			expect(res.status).toHaveBeenCalledWith(404);
			expect(res.json).toHaveBeenCalledWith({
				success: false,
				error: "Profile not found",
			});
		});

		it("deletes profile and conversations", async () => {
			const req = { params: { id: "id" }, userId: "user-id" } as any;
			const res = mockRes();

			const profile = { _id: "profile-id" };
			(Profile.findOne as jest.Mock).mockResolvedValue(profile);

			await deleteProfile(req, res);

			expect(Conversation.deleteMany).toHaveBeenCalledWith({
				profileId: "profile-id",
			});
			expect(Profile.deleteOne).toHaveBeenCalledWith({ _id: "profile-id" });
			expect(res.json).toHaveBeenCalledWith({
				success: true,
				message: "Profile and associated conversations deleted",
			});
		});

		it("returns 500 on error", async () => {
			const req = { params: { id: "id" }, userId: "user-id" } as any;
			const res = mockRes();

			(Profile.findOne as jest.Mock).mockRejectedValue(new Error("db"));

			await deleteProfile(req, res);

			expect(res.status).toHaveBeenCalledWith(500);
		});
	});
});
