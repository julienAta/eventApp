import express from "express";
import { getChatMessages } from "../controllers/chatController.js";
import { authenticateJWT } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/:eventId/messages", authenticateJWT, getChatMessages);

export default router;
