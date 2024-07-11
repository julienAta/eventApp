import { Request, Response, NextFunction } from "express";
import * as chatModel from "../models/chatModel.js";
import { EventEmitter } from "events";

const chatEmitter = new EventEmitter();

export const getChatMessages = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const eventId = req.params.eventId;
    const messages = await chatModel.getChatMessages(eventId);

    res.json({ message: "Chat messages fetched successfully", messages });
  } catch (error) {
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

    res
      .status(201)
      .json({ message: "Message created successfully", newMessage });
  } catch (error) {
    console.error("Error in createChatMessage:", error);
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

  const newMessageListener = (message: any) => {
    if (message.event_id === eventId) {
      res.write(`data: ${JSON.stringify(message)}\n\n`);
    }
  };

  chatEmitter.on("newMessage", newMessageListener);

  req.on("close", () => {
    chatEmitter.off("newMessage", newMessageListener);
  });
};
