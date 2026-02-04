import mongoose, { Schema, Document, Types } from "mongoose";

export type ProfileStatus = "in-progress" | "complete";

export type SectionStatus = "not-started" | "in-progress" | "complete";

export interface IProfileSection {
	title: string;
	status: SectionStatus;
	description?: string;
}

export interface IProfile extends Document {
	userId: Types.ObjectId;
	studentName: string;
	gradeLevel: string;
	age?: number;
	school?: string;
	relationship: string;
	accessCode: string;
	accessCodeExpiresAt: Date;
	percentComplete: number;
	status: ProfileStatus;
	sections: IProfileSection[];
	teacherEmail?: string;
	createdAt: Date;
	updatedAt: Date;
}

const profileSectionSchema = new Schema<IProfileSection>(
	{
		title: {
			type: String,
			required: true,
		},
		status: {
			type: String,
			required: true,
			enum: ["not-started", "in-progress", "complete"],
			default: "not-started",
		},
		description: {
			type: String,
		},
	},
	{ _id: false }
);

const profileSchema = new Schema<IProfile>(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		studentName: {
			type: String,
			required: true,
			trim: true,
		},
		gradeLevel: {
			type: String,
			required: true,
		},
		age: {
			type: Number,
			min: 4,
			max: 18,
		},
		school: {
			type: String,
			trim: true,
		},
		relationship: {
			type: String,
			required: true,
			enum: [
				"parent",
				"guardian",
				"grandparent",
				"caregiver",
				"educator",
				"other",
			],
		},
		accessCode: {
			type: String,
			required: true,
			unique: true,
		},
		accessCodeExpiresAt: {
			type: Date,
			required: true,
		},
		percentComplete: {
			type: Number,
			default: 0,
			min: 0,
			max: 100,
		},
		status: {
			type: String,
			required: true,
			enum: ["in-progress", "complete"],
			default: "in-progress",
		},
		sections: {
			type: [profileSectionSchema],
			default: [
				{ title: "Interest Awareness", status: "not-started" },
				{ title: "Racial/Cultural Pride", status: "not-started" },
				{ title: "Can-Do Attitude", status: "not-started" },
				{ title: "Multicultural Navigation", status: "not-started" },
				{ title: "Selective Trust", status: "not-started" },
				{ title: "Social Justice", status: "not-started" },
			],
		},
		teacherEmail: {
			type: String,
			lowercase: true,
			trim: true,
		},
	},
	{
		timestamps: true,
	}
);

profileSchema.index({ userId: 1 });
profileSchema.index({ accessCode: 1 });

export const Profile = mongoose.model<IProfile>("Profile", profileSchema);
