import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
	email: string;
	password?: string;
	firstName: string;
	lastName: string;
	role: "Parent/Caregiver" | "Educator" | "Student";
	googleId?: string;
	avatar?: string;
	agreedToTerms: boolean;
	focusGroupOptIn: boolean;
	refreshTokens: string[];
	createdAt: Date;
	updatedAt: Date;
}

const userSchema = new Schema<IUser>(
	{
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
		},
		password: {
			type: String,
			minlength: 8,
		},
		firstName: {
			type: String,
			required: true,
			trim: true,
		},
		lastName: {
			type: String,
			required: true,
			trim: true,
		},
		role: {
			type: String,
			required: true,
			enum: ["Parent/Caregiver", "Educator", "Student"],
		},
		googleId: {
			type: String,
			unique: true,
			sparse: true,
		},
		avatar: {
			type: String,
		},
		agreedToTerms: {
			type: Boolean,
			required: true,
			default: false,
		},
		focusGroupOptIn: {
			type: Boolean,
			default: false,
		},
		refreshTokens: {
			type: [String],
			default: [],
		},
	},
	{
		timestamps: true,
	}
);

export const User = mongoose.model<IUser>("User", userSchema);
