import { Response } from "express";
import { Profile } from "../models/profile.model";
import { Conversation } from "../models/conversation.model";
import { User } from "../models/user.model";
import { AuthRequest } from "../middleware/auth.middleware";
import { createProfileSchema } from "../validators/profile.validator";

function generateAccessCode(): string {
	const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
	let code = "";
	for (let i = 0; i < 8; i++) {
		code += chars.charAt(Math.floor(Math.random() * chars.length));
	}
	return `${code.slice(0, 4)}-${code.slice(4)}`;
}

async function sendAccessCodeEmail(
	email: string,
	studentName: string,
	accessCode: string,
): Promise<void> {
	console.log("──────────────────────────────────────");
	console.log("📧 MOCK EMAIL SENT");
	console.log(`To: ${email}`);
	console.log(`Subject: Your Genius Profile Access Code`);
	console.log(`Body:`);
	console.log(`  Hi! Your access code for ${studentName}'s profile is:`);
	console.log(`  ${accessCode}`);
	console.log(`  Use this code to resume your conversation anytime.`);
	console.log("──────────────────────────────────────");
}

export async function getProfiles(
	req: AuthRequest,
	res: Response,
): Promise<void> {
	try {
		const profiles = await Profile.find({ userId: req.userId })
			.select("-__v")
			.sort({ updatedAt: -1 });

		res.json({
			success: true,
			data: profiles,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			error: "Failed to fetch profiles",
		});
	}
}

export async function createProfile(
	req: AuthRequest,
	res: Response,
): Promise<void> {
	try {
		const { error, value } = createProfileSchema.validate(req.body, {
			abortEarly: false,
		});

		if (error) {
			res.status(400).json({
				success: false,
				error: error.details[0].message,
			});
			return;
		}

		const user = await User.findById(req.userId);
		if (!user) {
			res.status(404).json({ success: false, error: "User not found" });
			return;
		}

		const accessCode = generateAccessCode();
		const accessCodeExpiresAt = new Date();
		accessCodeExpiresAt.setDate(accessCodeExpiresAt.getDate() + 30);

		const profile = await Profile.create({
			userId: req.userId,
			studentName: value.studentName,
			gradeLevel: value.gradeLevel,
			age: value.age || undefined,
			school: value.school || undefined,
			relationship: value.relationship,
			accessCode,
			accessCodeExpiresAt,
		});

		const conversation = await Conversation.create({
			profileId: profile._id,
			userId: req.userId,
			currentSection: "Interest Awareness",
			messages: [
				{
					sender: "ai",
					senderName: "Genius Guide",
					message: `Welcome! I'm here to help build ${value.studentName}'s Genius Profile. Let's start by exploring their interests. What activities or subjects does ${value.studentName} enjoy the most?`,
					timestamp: new Date(),
				},
			],
		});

		await sendAccessCodeEmail(user.email, value.studentName, accessCode);

		res.status(201).json({
			success: true,
			data: {
				profile: {
					id: profile._id,
					studentName: profile.studentName,
					accessCode: profile.accessCode,
					status: profile.status,
				},
				conversationId: conversation._id,
			},
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			error: "Failed to create profile",
		});
	}
}
