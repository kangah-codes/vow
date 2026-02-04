import { Router } from "express";
import healthRoutes from "./health.routes";
import authRoutes from "./auth.routes";
import profileRoutes from "./profile.routes";
import conversationRoutes from "./conversation.routes";
import sharedRoutes from "./shared.routes";

const router = Router();

router.use("/health", healthRoutes);
router.use("/auth", authRoutes);
router.use("/profiles", profileRoutes);
router.use("/conversations", conversationRoutes);
router.use("/shared", sharedRoutes);

export default router;
