import { Router } from "express";
import { getProfiles, createProfile } from "../controllers/profile.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();

router.get("/", requireAuth, getProfiles);
router.post("/", requireAuth, createProfile);

export default router;
