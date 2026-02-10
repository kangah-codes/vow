import crypto from "crypto";
import { Request, Response } from "express";
import { User } from "../models/user.model";
import { AuthRequest } from "../middleware/auth.middleware";
import {
	hashPassword,
	comparePassword,
	generateAccessToken,
	generateRefreshToken,
} from "../services/auth.service";
import { signupSchema, loginSchema } from "../validators/auth.validator";
import { logger } from "../utils/logger";

export async function signup(req: Request, res: Response): Promise<void> {
	try {
		const { error, value } = signupSchema.validate(req.body, {
			abortEarly: false,
		});

		if (error) {
			res.status(400).json({
				success: false,
				error: error.details[0].message,
			});
			return;
		}

		const {
			email,
			password,
			firstName,
			lastName,
			role,
			agreedToTerms,
			focusGroupOptIn,
		} = value;

		const existingUser = await User.findOne({ email: email.toLowerCase() });
		if (existingUser) {
			res.status(409).json({
				success: false,
				error: "An account with this email already exists",
			});
			return;
		}

		const hashedPassword = await hashPassword(password);

		const user = await User.create({
			email,
			password: hashedPassword,
			firstName,
			lastName,
			role,
			agreedToTerms,
			focusGroupOptIn: focusGroupOptIn ?? false,
		});

		const accessToken = generateAccessToken(user._id.toString());
		const refreshToken = generateRefreshToken(user._id.toString());

		user.refreshTokens.push(refreshToken);
		await user.save();

		res.status(201).json({
			success: true,
			data: {
				user: {
					id: user._id,
					email: user.email,
					firstName: user.firstName,
					lastName: user.lastName,
					role: user.role,
					focusGroupOptIn: user.focusGroupOptIn,
				},
				accessToken,
				refreshToken,
			},
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			error: "Failed to create account",
		});
	}
}

export async function login(req: Request, res: Response): Promise<void> {
	try {
		const { error, value } = loginSchema.validate(req.body, {
			abortEarly: false,
		});

		if (error) {
			res.status(400).json({
				success: false,
				error: error.details[0].message,
			});
			return;
		}

		const { email, password } = value;

		const user = await User.findOne({ email: email.toLowerCase() });
		if (!user || !user.password) {
			res.status(401).json({
				success: false,
				error: "Invalid email or password",
			});
			return;
		}

		const isMatch = await comparePassword(password, user.password);
		if (!isMatch) {
			res.status(401).json({
				success: false,
				error: "Invalid email or password",
			});
			return;
		}

		const accessToken = generateAccessToken(user._id.toString());
		const refreshToken = generateRefreshToken(user._id.toString());

		user.refreshTokens.push(refreshToken);
		await user.save();

		res.json({
			success: true,
			data: {
				user: {
					id: user._id,
					email: user.email,
					firstName: user.firstName,
					lastName: user.lastName,
					role: user.role,
				},
				accessToken,
				refreshToken,
			},
		});
	} catch (error) {
		logger.error("Login error:", error);
		res.status(500).json({
			success: false,
			error: "Login failed",
		});
	}
}

export async function getMe(req: AuthRequest, res: Response): Promise<void> {
	try {
		const user = await User.findById(req.userId).select(
			"-password -refreshTokens -__v",
		);

		if (!user) {
			res.status(404).json({ success: false, error: "User not found" });
			return;
		}

		res.json({
			success: true,
			data: {
				id: user._id,
				email: user.email,
				firstName: user.firstName,
				lastName: user.lastName,
				role: user.role,
				focusGroupOptIn: user.focusGroupOptIn,
				focusGroupPrompted: user.focusGroupPrompted,
			},
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			error: "Failed to fetch user",
		});
	}
}

export async function logout(req: AuthRequest, res: Response): Promise<void> {
	try {
		const refreshToken = req.body.refreshToken;
		if (!refreshToken) {
			res.status(400).json({
				success: false,
				error: "Refresh token is required",
			});
			return;
		}

		const user = await User.findById(req.userId);
		if (!user) {
			res.status(404).json({ success: false, error: "User not found" });
			return;
		}

		user.refreshTokens = user.refreshTokens.filter(
			(token) => token !== refreshToken,
		);
		await user.save();

		res.json({ success: true, message: "Logged out successfully" });
	} catch (error) {
		res.status(500).json({
			success: false,
			error: "Logout failed",
		});
	}
}

export async function forgotPassword(
	req: Request,
	res: Response,
): Promise<void> {
	try {
		const { email } = req.body;
		if (!email) {
			res.status(400).json({
				success: false,
				error: "Email is required",
			});
			return;
		}

		const user = await User.findOne({ email: email.toLowerCase() });

		// Always return success to avoid email enumeration
		if (!user) {
			res.json({
				success: true,
				message:
					"If an account with that email exists, a reset link has been sent.",
			});
			return;
		}

		const resetToken = crypto.randomBytes(32).toString("hex");
		const resetTokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

		user.resetToken = resetToken;
		user.resetTokenExpiresAt = resetTokenExpiresAt;
		await user.save();

		// Mock email sending — log the reset link to console
		const resetUrl = `http://localhost:3000/password-reset/${resetToken}`;
		console.log("──────────────────────────────────────────");
		console.log("📧 Password Reset Email (mock)");
		console.log(`   To: ${user.email}`);
		console.log(`   Reset Link: ${resetUrl}`);
		console.log(`   Expires: ${resetTokenExpiresAt.toISOString()}`);
		console.log("──────────────────────────────────────────");

		res.json({
			success: true,
			message:
				"If an account with that email exists, a reset link has been sent.",
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			error: "Failed to process password reset request",
		});
	}
}

export async function resetPassword(
	req: Request,
	res: Response,
): Promise<void> {
	try {
		const { token } = req.params;
		const { password } = req.body;

		if (!password || password.length < 8) {
			res.status(400).json({
				success: false,
				error: "Password must be at least 8 characters",
			});
			return;
		}

		const user = await User.findOne({
			resetToken: token,
			resetTokenExpiresAt: { $gt: new Date() },
		});

		if (!user) {
			res.status(400).json({
				success: false,
				error: "Invalid or expired reset link",
			});
			return;
		}

		user.password = await hashPassword(password);
		user.resetToken = undefined;
		user.resetTokenExpiresAt = undefined;
		user.refreshTokens = []; // Invalidate all sessions
		await user.save();

		res.json({
			success: true,
			message: "Password has been reset successfully",
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			error: "Failed to reset password",
		});
	}
}

export async function updateFocusGroup(
	req: AuthRequest,
	res: Response,
): Promise<void> {
	try {
		const { optIn } = req.body;

		if (typeof optIn !== "boolean") {
			res.status(400).json({
				success: false,
				error: "optIn must be a boolean",
			});
			return;
		}

		const user = await User.findById(req.userId);
		if (!user) {
			res.status(404).json({ success: false, error: "User not found" });
			return;
		}

		user.focusGroupOptIn = optIn;
		user.focusGroupPrompted = true;
		await user.save();

		res.json({
			success: true,
			data: {
				focusGroupOptIn: user.focusGroupOptIn,
				focusGroupPrompted: user.focusGroupPrompted,
			},
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			error: "Failed to update focus group preference",
		});
	}
}
