import { Router } from "express";
import {
  getChatMessages,
  createChatMessage,
  streamChatMessages,
} from "../controllers/chatController";
import { authenticateJWT } from "../middlewares/authMiddleware";

const router = Router();
router.get("/:eventId/stream", streamChatMessages);
router.use(authenticateJWT);
router.get("/:eventId/messages", getChatMessages);
router.post("/:eventId/messages", createChatMessage);

export default router;
