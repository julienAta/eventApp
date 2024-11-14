import { Router } from "express";
import { supabase } from "../supabase/supabaseClient";
import { logger } from "../utils/logger";
import { authenticateJWT } from "../middlewares/authMiddleware";

const chatRouter = Router();

chatRouter.get("/:eventId/messages", authenticateJWT, async (req, res) => {
  try {
    const { eventId } = req.params;

    if (!eventId) {
      return res.status(400).json({ error: "Event ID is required" });
    }

    logger.info(`Fetching messages for event: ${eventId}`);

    const { data: messages, error } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("event_id", eventId)
      .order("created_at", { ascending: true });

    if (error) {
      logger.error("Supabase error fetching messages:", error);
      throw error;
    }

    if (!messages) {
      return res.json({ messages: [] });
    }

    logger.info(
      `Successfully fetched ${messages.length} messages for event ${eventId}`
    );
    return res.json({ messages });
  } catch (error) {
    logger.error("Error fetching messages:", error);
    return res.status(500).json({
      error: "Failed to fetch messages",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default chatRouter;
