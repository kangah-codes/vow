import { Request, Response } from "express";
import { Profile } from "../models/profile.model";
import { Conversation } from "../models/conversation.model";

export async function getSharedConversation(
	req: Request,
	res: Response,
): Promise<void> {
	try {
		const { accessCode } = req.params;

		const profile = await Profile.findOne({ accessCode }).select(
			"studentName gradeLevel percentComplete status sections accessCode accessCodeExpiresAt",
		);

		if (!profile) {
			res.status(404).json({
				success: false,
				error: "Invalid access code",
			});
			return;
		}

		if (profile.accessCodeExpiresAt < new Date()) {
			res.status(410).json({
				success: false,
				error: "Access code has expired",
			});
			return;
		}

		const conversation = await Conversation.findOne({
			profileId: profile._id,
		}).select("-__v");

		if (!conversation) {
			res.status(404).json({
				success: false,
				error: "Conversation not found",
			});
			return;
		}

		res.json({
			success: true,
			data: {
				conversation,
				profile,
			},
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			error: "Failed to fetch shared conversation",
		});
	}
}
