import Joi from "joi";

export const createProfileSchema = Joi.object({
	studentName: Joi.string().trim().required().messages({
		"any.required": "Student's name is required",
		"string.empty": "Student's name is required",
	}),
	gradeLevel: Joi.string()
		.valid(
			"pre-k",
			"k",
			"1",
			"2",
			"3",
			"4",
			"5",
			"6",
			"7",
			"8",
			"9",
			"10",
			"11",
			"12",
		)
		.required()
		.messages({
			"any.required": "Grade level is required",
			"any.only": "Please select a valid grade level",
		}),
	age: Joi.number().integer().min(4).max(18).optional().messages({
		"number.min": "Age must be between 4 and 18",
		"number.max": "Age must be between 4 and 18",
	}),
	school: Joi.string().trim().allow("").optional(),
	relationship: Joi.string()
		.valid("parent", "guardian", "grandparent", "caregiver", "educator", "other")
		.required()
		.messages({
			"any.required": "Relationship is required",
			"any.only": "Please select a valid relationship",
		}),
});
