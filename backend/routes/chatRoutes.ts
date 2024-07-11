import { Router } from "express";
import {
  getChatMessages,
  createChatMessage,
  streamChatMessages,
} from "../controllers/chatController";
import { authenticateJWT } from "../middlewares/authMiddleware";

const router = Router();
router.get("/:eventId/messages", getChatMessages);
router.post("/:eventId/messages", createChatMessage);
router.get("/:eventId/stream", streamChatMessages);
router.use(authenticateJWT);

export default router;
