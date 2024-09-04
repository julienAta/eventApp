import { Request, Response, NextFunction } from "express";
import * as chatModel from "../models/chatModel.js";
import { EventEmitter } from "events";
import { logger } from "../app.js";

const chatEmitter = new EventEmitter();

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

export const createChatMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const eventId = req.params.eventId;
    const { content, user_id } = req.body;

    const newMessage = await chatModel.addChatMessage({
      event_id: eventId,
      user_id,
      content,
    });

    logger.info("Chat message created successfully", {
      eventId,
      userId: user_id,
    });
    res
      .status(201)
      .json({ message: "Message created successfully", newMessage });

    chatEmitter.emit("newMessage", newMessage);
  } catch (error) {
    logger.error("Error in createChatMessage", {
      error,
      eventId: req.params.eventId,
      userId: req.body.user_id,
    });
    res
      .status(500)
      .json({ message: "An error occurred while creating the chat message" });
  }
};

export const streamChatMessages = (req: Request, res: Response): void => {
  const eventId = req.params.eventId;

  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  logger.info("Chat message stream opened", { eventId });

  const newMessageListener = (message: any) => {
    if (message.event_id === eventId) {
      res.write(`data: ${JSON.stringify(message)}\n\n`);
      logger.debug("New message sent to stream", {
        eventId,
        messageId: message.id,
      });
    }
  };

  chatEmitter.on("newMessage", newMessageListener);

  req.on("close", () => {
    chatEmitter.off("newMessage", newMessageListener);
    logger.info("Chat message stream closed", { eventId });
  });
};

chatEmitter.on("error", (error) => {
  logger.error("ChatEmitter encountered an error", { error });
});
