import { Request, Response, NextFunction } from "express";
import passport from "../config/passport";

export interface AuthRequest extends Request {
	userId?: string;
}

export function requireAuth(
	req: AuthRequest,
	res: Response,
	next: NextFunction,
): void {
	passport.authenticate(
		"jwt",
		{ session: false },
		(err: Error | null, user: { userId: string } | false) => {
			if (err) {
				res.status(401).json({
					success: false,
					error: "Invalid or expired token",
				});
				return;
			}

			if (!user) {
				const authHeader = req.headers.authorization;
				if (!authHeader?.startsWith("Bearer ")) {
					res.status(401).json({
						success: false,
						error: "You must be signed in to perform this action",
					});
				} else {
					res.status(401).json({
						success: false,
						error: "Invalid or expired token",
					});
				}
				return;
			}

			req.userId = user.userId;
			next();
		},
	)(req, res, next);
}
