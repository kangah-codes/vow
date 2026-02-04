import Joi from "joi";

export const signupSchema = Joi.object({
	email: Joi.string().email().required().messages({
		"string.email": "Please provide a valid email address",
		"any.required": "Email is required",
	}),
	password: Joi.string().min(8).required().messages({
		"string.min": "Password must be at least 8 characters",
		"any.required": "Password is required",
	}),
	firstName: Joi.string().required().messages({
		"any.required": "First name is required",
	}),
	lastName: Joi.string().required().messages({
		"any.required": "Last name is required",
	}),
	role: Joi.string().required().messages({
		"any.required": "Role is required",
	}),
	agreedToTerms: Joi.boolean().valid(true).required().messages({
		"any.only": "You must agree to the Terms of Service",
		"any.required": "You must agree to the Terms of Service",
	}),
	focusGroupOptIn: Joi.boolean().optional(),
});

export const loginSchema = Joi.object({
	email: Joi.string().email().required().messages({
		"string.email": "Please provide a valid email address",
		"any.required": "Email is required",
	}),
	password: Joi.string().required().messages({
		"any.required": "Password is required",
	}),
});
