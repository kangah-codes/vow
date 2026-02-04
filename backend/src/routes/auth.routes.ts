import { Router } from "express";
import {
	signup,
	login,
	getMe,
	logout,
	forgotPassword,
	resetPassword,
	updateFocusGroup,
} from "../controllers/auth.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", requireAuth, getMe);
router.post("/logout", requireAuth, logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/focus-group", requireAuth, updateFocusGroup);

export default router;
