import { Router } from "express";
import { getSharedConversation } from "../controllers/shared.controller";

const router = Router();

router.get("/:accessCode", getSharedConversation);

export default router;
