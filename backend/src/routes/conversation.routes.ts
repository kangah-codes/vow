import { Router } from "express";
import { getConversation } from "../controllers/conversation.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();

router.get("/:id", requireAuth, getConversation);

export default router;
