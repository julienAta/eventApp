import { Request, Response } from "express";
import * as chatModel from "../models/chatModel.js";
import { logger } from "../utils/logger";

export const getChatMessages = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const eventId = req.params.eventId;
    const messages = await chatModel.getChatMessages(eventId);

    logger.info("Chat messages fetched successfully", { eventId });
    res.json({ message: "Chat messages fetched successfully", messages });
  } catch (error) {
    logger.error("Error occurred while fetching chat messages", {
      error,
      eventId: req.params.eventId,
    });
    res
      .status(500)
      .json({ message: "An error occurred while fetching chat messages" });
  }
};
