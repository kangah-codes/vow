import mongoose, { Schema, Document, Types } from "mongoose";

export interface IMessage {
	sender: "ai" | "user";
	senderName: string;
	message: string;
	timestamp: Date;
}

export interface IConversation extends Document {
	profileId: Types.ObjectId;
	userId: Types.ObjectId;
	messages: IMessage[];
	currentSection?: string;
	createdAt: Date;
	updatedAt: Date;
}

const messageSchema = new Schema<IMessage>(
	{
		sender: {
			type: String,
			required: true,
			enum: ["ai", "user"],
		},
		senderName: {
			type: String,
			required: true,
		},
		message: {
			type: String,
			required: true,
		},
		timestamp: {
			type: Date,
			required: true,
			default: Date.now,
		},
	},
	{ _id: true }
);

const conversationSchema = new Schema<IConversation>(
	{
		profileId: {
			type: Schema.Types.ObjectId,
			ref: "Profile",
			required: true,
		},
		userId: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		messages: {
			type: [messageSchema],
			default: [],
		},
		currentSection: {
			type: String,
		},
	},
	{
		timestamps: true,
	}
);

conversationSchema.index({ profileId: 1 });
conversationSchema.index({ userId: 1 });

export const Conversation = mongoose.model<IConversation>(
	"Conversation",
	conversationSchema
);
