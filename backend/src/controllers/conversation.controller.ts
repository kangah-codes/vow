import { Response } from "express";
import { Conversation } from "../models/conversation.model";
import { Profile } from "../models/profile.model";
import { AuthRequest } from "../middleware/auth.middleware";

export async function getConversation(
	req: AuthRequest,
	res: Response,
): Promise<void> {
	try {
		const conversation = await Conversation.findOne({
			_id: req.params.id,
			userId: req.userId,
		}).select("-__v");

		if (!conversation) {
			res.status(404).json({
				success: false,
				error: "Conversation not found",
			});
			return;
		}

		const profile = await Profile.findById(conversation.profileId).select(
			"studentName gradeLevel percentComplete status sections accessCode",
		);

		res.json({
			success: true,
			data: {
				conversation,
				profile,
			},
		});
	} catch (error) {
		if ((error as { name?: string }).name === "CastError") {
			res.status(404).json({
				success: false,
				error: "Conversation not found",
			});
			return;
		}
		res.status(500).json({
			success: false,
			error: "Failed to fetch conversation",
		});
	}
}
