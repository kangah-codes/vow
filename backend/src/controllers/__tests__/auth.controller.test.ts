import type { Request, Response } from "express";
import crypto from "crypto";
import {
	signup,
	login,
	getMe,
	logout,
	forgotPassword,
	resetPassword,
	updateFocusGroup,
} from "../auth.controller";
import { User } from "../../models/user.model";
import {
	hashPassword,
	comparePassword,
	generateAccessToken,
	generateRefreshToken,
} from "../../services/auth.service";

jest.mock("../../models/user.model", () => ({
	User: {
		findOne: jest.fn(),
		create: jest.fn(),
		findById: jest.fn(),
	},
}));

jest.mock("../../services/auth.service", () => ({
	hashPassword: jest.fn(),
	comparePassword: jest.fn(),
	generateAccessToken: jest.fn(),
	generateRefreshToken: jest.fn(),
}));

const mockRes = () => {
	const res = {
		status: jest.fn(),
		json: jest.fn(),
	} as unknown as Response;
	(res.status as jest.Mock).mockReturnValue(res);
	return res as Response & { status: jest.Mock; json: jest.Mock };
};

describe("auth.controller", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe("signup", () => {
		it("returns 400 on validation error", async () => {
			const req = { body: { email: "invalid" } } as any;
			const res = mockRes();

			await signup(req, res);

			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.json).toHaveBeenCalledWith(
				expect.objectContaining({ success: false }),
			);
		});

		it("returns 409 if user already exists", async () => {
			const req = {
				body: {
					email: "test@example.com",
					password: "password123",
					firstName: "Test",
					lastName: "User",
					role: "Parent/Caregiver",
					agreedToTerms: true,
				},
			} as any;
			const res = mockRes();

			(User.findOne as jest.Mock).mockResolvedValue({ _id: "existing" });

			await signup(req, res);

			expect(res.status).toHaveBeenCalledWith(409);
			expect(res.json).toHaveBeenCalledWith({
				success: false,
				error: "An account with this email already exists",
			});
		});

		it("creates user and returns tokens", async () => {
			const req = {
				body: {
					email: "Test@Example.com",
					password: "password123",
					firstName: "Test",
					lastName: "User",
					role: "Parent/Caregiver",
					agreedToTerms: true,
				},
			} as any;
			const res = mockRes();

			(User.findOne as jest.Mock).mockResolvedValue(null);
			(hashPassword as jest.Mock).mockResolvedValue("hashed");
			(generateAccessToken as jest.Mock).mockReturnValue("access");
			(generateRefreshToken as jest.Mock).mockReturnValue("refresh");

			const save = jest.fn();
			const user = {
				_id: { toString: () => "user-id" },
				email: "test@example.com",
				firstName: "Test",
				lastName: "User",
				role: "Parent/Caregiver",
				focusGroupOptIn: false,
				refreshTokens: [] as string[],
				save,
			};
			(User.create as jest.Mock).mockResolvedValue(user);

			await signup(req, res);

			expect(hashPassword).toHaveBeenCalledWith("password123");
			expect(User.create).toHaveBeenCalledWith(
				expect.objectContaining({
					email: "Test@Example.com",
					password: "hashed",
					focusGroupOptIn: false,
				}),
			);
			expect(generateAccessToken).toHaveBeenCalledWith("user-id");
			expect(generateRefreshToken).toHaveBeenCalledWith("user-id");
			expect(user.refreshTokens).toEqual(["refresh"]);
			expect(save).toHaveBeenCalled();
			expect(res.status).toHaveBeenCalledWith(201);
			expect(res.json).toHaveBeenCalledWith(
				expect.objectContaining({
					success: true,
					data: expect.objectContaining({
						accessToken: "access",
						refreshToken: "refresh",
					}),
				}),
			);
		});

		it("returns 500 on unexpected error", async () => {
			const req = {
				body: {
					email: "test@example.com",
					password: "password123",
					firstName: "Test",
					lastName: "User",
					role: "Parent/Caregiver",
					agreedToTerms: true,
				},
			} as any;
			const res = mockRes();
			(User.findOne as jest.Mock).mockRejectedValue(new Error("db"));

			await signup(req, res);

			expect(res.status).toHaveBeenCalledWith(500);
			expect(res.json).toHaveBeenCalledWith({
				success: false,
				error: "Failed to create account",
			});
		});
	});

	describe("login", () => {
		it("returns 400 on validation error", async () => {
			const req = { body: { email: "invalid" } } as any;
			const res = mockRes();

			await login(req, res);

			expect(res.status).toHaveBeenCalledWith(400);
		});

		it("returns 401 when user not found", async () => {
			const req = {
				body: { email: "test@example.com", password: "password123" },
			} as any;
			const res = mockRes();

			(User.findOne as jest.Mock).mockResolvedValue(null);

			await login(req, res);

			expect(res.status).toHaveBeenCalledWith(401);
			expect(res.json).toHaveBeenCalledWith({
				success: false,
				error: "Invalid email or password",
			});
		});

		it("returns 401 when password missing", async () => {
			const req = {
				body: { email: "test@example.com", password: "password123" },
			} as any;
			const res = mockRes();

			(User.findOne as jest.Mock).mockResolvedValue({ password: undefined });

			await login(req, res);

			expect(res.status).toHaveBeenCalledWith(401);
		});

		it("returns 401 when password mismatch", async () => {
			const req = {
				body: { email: "test@example.com", password: "password123" },
			} as any;
			const res = mockRes();

			(User.findOne as jest.Mock).mockResolvedValue({ password: "hash" });
			(comparePassword as jest.Mock).mockResolvedValue(false);

			await login(req, res);

			expect(comparePassword).toHaveBeenCalledWith("password123", "hash");
			expect(res.status).toHaveBeenCalledWith(401);
		});

		it("returns tokens on success", async () => {
			const req = {
				body: { email: "test@example.com", password: "password123" },
			} as any;
			const res = mockRes();

			const save = jest.fn();
			const user = {
				_id: { toString: () => "user-id" },
				email: "test@example.com",
				firstName: "Test",
				lastName: "User",
				role: "Parent/Caregiver",
				password: "hash",
				refreshTokens: [] as string[],
				save,
			};
			(User.findOne as jest.Mock).mockResolvedValue(user);
			(comparePassword as jest.Mock).mockResolvedValue(true);
			(generateAccessToken as jest.Mock).mockReturnValue("access");
			(generateRefreshToken as jest.Mock).mockReturnValue("refresh");

			await login(req, res);

			expect(user.refreshTokens).toEqual(["refresh"]);
			expect(save).toHaveBeenCalled();
			expect(res.json).toHaveBeenCalledWith(
				expect.objectContaining({
					success: true,
					data: expect.objectContaining({
						accessToken: "access",
						refreshToken: "refresh",
					}),
				}),
			);
		});

		it("returns 500 on unexpected error", async () => {
			const req = {
				body: { email: "test@example.com", password: "password123" },
			} as any;
			const res = mockRes();
			(User.findOne as jest.Mock).mockRejectedValue(new Error("db"));

			await login(req, res);

			expect(res.status).toHaveBeenCalledWith(500);
			expect(res.json).toHaveBeenCalledWith({
				success: false,
				error: "Login failed",
			});
		});
	});

	describe("getMe", () => {
		it("returns 404 when user not found", async () => {
			const req = { userId: "user-id" } as any;
			const res = mockRes();

			(User.findById as jest.Mock).mockReturnValue({
				select: jest.fn().mockResolvedValue(null),
			});

			await getMe(req as any, res);

			expect(res.status).toHaveBeenCalledWith(404);
			expect(res.json).toHaveBeenCalledWith({
				success: false,
				error: "User not found",
			});
		});

		it("returns user data", async () => {
			const req = { userId: "user-id" } as any;
			const res = mockRes();

			const user = {
				_id: "user-id",
				email: "test@example.com",
				firstName: "Test",
				lastName: "User",
				role: "Parent/Caregiver",
				focusGroupOptIn: false,
				focusGroupPrompted: true,
			};
			(User.findById as jest.Mock).mockReturnValue({
				select: jest.fn().mockResolvedValue(user),
			});

			await getMe(req as any, res);

			expect(res.json).toHaveBeenCalledWith({
				success: true,
				data: expect.objectContaining({
					email: "test@example.com",
					focusGroupOptIn: false,
					focusGroupPrompted: true,
				}),
			});
		});

		it("returns 500 on unexpected error", async () => {
			const req = { userId: "user-id" } as any;
			const res = mockRes();

			(User.findById as jest.Mock).mockImplementation(() => {
				throw new Error("db");
			});

			await getMe(req as any, res);

			expect(res.status).toHaveBeenCalledWith(500);
		});
	});

	describe("logout", () => {
		it("returns 400 when refresh token missing", async () => {
			const req = { body: {} } as any;
			const res = mockRes();

			await logout(req as any, res);

			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.json).toHaveBeenCalledWith({
				success: false,
				error: "Refresh token is required",
			});
		});

		it("returns 404 when user not found", async () => {
			const req = { body: { refreshToken: "token" }, userId: "id" } as any;
			const res = mockRes();

			(User.findById as jest.Mock).mockResolvedValue(null);

			await logout(req as any, res);

			expect(res.status).toHaveBeenCalledWith(404);
		});

		it("removes refresh token on success", async () => {
			const req = { body: { refreshToken: "token" }, userId: "id" } as any;
			const res = mockRes();

			const save = jest.fn();
			const user = {
				refreshTokens: ["token", "other"],
				save,
			};
			(User.findById as jest.Mock).mockResolvedValue(user);

			await logout(req as any, res);

			expect(user.refreshTokens).toEqual(["other"]);
			expect(save).toHaveBeenCalled();
			expect(res.json).toHaveBeenCalledWith({
				success: true,
				message: "Logged out successfully",
			});
		});

		it("returns 500 on unexpected error", async () => {
			const req = { body: { refreshToken: "token" }, userId: "id" } as any;
			const res = mockRes();

			(User.findById as jest.Mock).mockRejectedValue(new Error("db"));

			await logout(req as any, res);

			expect(res.status).toHaveBeenCalledWith(500);
		});
	});

	describe("forgotPassword", () => {
		it("returns 400 when email missing", async () => {
			const req = { body: {} } as any;
			const res = mockRes();

			await forgotPassword(req, res);

			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.json).toHaveBeenCalledWith({
				success: false,
				error: "Email is required",
			});
		});

		it("returns success even if user not found", async () => {
			const req = { body: { email: "test@example.com" } } as any;
			const res = mockRes();

			(User.findOne as jest.Mock).mockResolvedValue(null);

			await forgotPassword(req, res);

			expect(res.json).toHaveBeenCalledWith({
				success: true,
				message:
					"If an account with that email exists, a reset link has been sent.",
			});
		});

		it("sets reset token and returns success", async () => {
			const req = { body: { email: "test@example.com" } } as any;
			const res = mockRes();

			const save = jest.fn();
			const user = {
				email: "test@example.com",
				resetToken: undefined as string | undefined,
				resetTokenExpiresAt: undefined as Date | undefined,
				save,
			};
			(User.findOne as jest.Mock).mockResolvedValue(user);
			const randomBytesSpy = jest
				.spyOn(crypto, "randomBytes")
				.mockImplementation(() => Buffer.from("abc") as any);
			const consoleSpy = jest
				.spyOn(console, "log")
				.mockImplementation(() => undefined);

			await forgotPassword(req, res);

			expect(user.resetToken).toBe("616263");
			expect(user.resetTokenExpiresAt).toBeInstanceOf(Date);
			expect(save).toHaveBeenCalled();
			expect(res.json).toHaveBeenCalledWith({
				success: true,
				message:
					"If an account with that email exists, a reset link has been sent.",
			});
			randomBytesSpy.mockRestore();
			consoleSpy.mockRestore();
		});

		it("returns 500 on unexpected error", async () => {
			const req = { body: { email: "test@example.com" } } as any;
			const res = mockRes();

			(User.findOne as jest.Mock).mockRejectedValue(new Error("db"));

			await forgotPassword(req, res);

			expect(res.status).toHaveBeenCalledWith(500);
		});
	});

	describe("resetPassword", () => {
		it("returns 400 when password invalid", async () => {
			const req = { params: { token: "token" }, body: {} } as any;
			const res = mockRes();

			await resetPassword(req, res);

			expect(res.status).toHaveBeenCalledWith(400);
		});

		it("returns 400 when token invalid or expired", async () => {
			const req = {
				params: { token: "token" },
				body: { password: "password123" },
			} as any;
			const res = mockRes();

			(User.findOne as jest.Mock).mockResolvedValue(null);

			await resetPassword(req, res);

			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.json).toHaveBeenCalledWith({
				success: false,
				error: "Invalid or expired reset link",
			});
		});

		it("resets password and clears tokens", async () => {
			const req = {
				params: { token: "token" },
				body: { password: "password123" },
			} as any;
			const res = mockRes();

			const save = jest.fn();
			const user = {
				password: "old",
				resetToken: "token",
				resetTokenExpiresAt: new Date(),
				refreshTokens: ["a"],
				save,
			};
			(User.findOne as jest.Mock).mockResolvedValue(user);
			(hashPassword as jest.Mock).mockResolvedValue("hashed");

			await resetPassword(req, res);

			expect(user.password).toBe("hashed");
			expect(user.resetToken).toBeUndefined();
			expect(user.resetTokenExpiresAt).toBeUndefined();
			expect(user.refreshTokens).toEqual([]);
			expect(save).toHaveBeenCalled();
			expect(res.json).toHaveBeenCalledWith({
				success: true,
				message: "Password has been reset successfully",
			});
		});

		it("returns 500 on unexpected error", async () => {
			const req = {
				params: { token: "token" },
				body: { password: "password123" },
			} as any;
			const res = mockRes();

			(User.findOne as jest.Mock).mockRejectedValue(new Error("db"));

			await resetPassword(req, res);

			expect(res.status).toHaveBeenCalledWith(500);
		});
	});

	describe("updateFocusGroup", () => {
		it("returns 400 when optIn not boolean", async () => {
			const req = { body: { optIn: "yes" } } as any;
			const res = mockRes();

			await updateFocusGroup(req as any, res);

			expect(res.status).toHaveBeenCalledWith(400);
		});

		it("returns 404 when user not found", async () => {
			const req = { body: { optIn: true }, userId: "id" } as any;
			const res = mockRes();

			(User.findById as jest.Mock).mockResolvedValue(null);

			await updateFocusGroup(req as any, res);

			expect(res.status).toHaveBeenCalledWith(404);
		});

		it("updates focus group preferences", async () => {
			const req = { body: { optIn: true }, userId: "id" } as any;
			const res = mockRes();

			const save = jest.fn();
			const user = {
				focusGroupOptIn: false,
				focusGroupPrompted: false,
				save,
			};
			(User.findById as jest.Mock).mockResolvedValue(user);

			await updateFocusGroup(req as any, res);

			expect(user.focusGroupOptIn).toBe(true);
			expect(user.focusGroupPrompted).toBe(true);
			expect(save).toHaveBeenCalled();
			expect(res.json).toHaveBeenCalledWith({
				success: true,
				data: {
					focusGroupOptIn: true,
					focusGroupPrompted: true,
				},
			});
		});

		it("returns 500 on unexpected error", async () => {
			const req = { body: { optIn: true }, userId: "id" } as any;
			const res = mockRes();

			(User.findById as jest.Mock).mockRejectedValue(new Error("db"));

			await updateFocusGroup(req as any, res);

			expect(res.status).toHaveBeenCalledWith(500);
		});
	});
});
