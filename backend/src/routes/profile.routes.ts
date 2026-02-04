import { Router } from "express";
import {
	getProfiles,
	createProfile,
	deleteProfile,
} from "../controllers/profile.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();

router.get("/", requireAuth, getProfiles);
router.post("/", requireAuth, createProfile);
router.delete("/:id", requireAuth, deleteProfile);

export default router;
