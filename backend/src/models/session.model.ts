import mongoose, { Schema, Document, Types } from "mongoose";

export interface ISession extends Document {
	userId: Types.ObjectId;
	refreshToken: string;
	userAgent?: string;
	ip?: string;
	expiresAt: Date;
	createdAt: Date;
}

const sessionSchema = new Schema<ISession>(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		refreshToken: {
			type: String,
			required: true,
			unique: true,
		},
		userAgent: {
			type: String,
		},
		ip: {
			type: String,
		},
		expiresAt: {
			type: Date,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

sessionSchema.index({ userId: 1 });
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Session = mongoose.model<ISession>("Session", sessionSchema);
