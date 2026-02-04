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
