import { Request, Response } from "express";
import * as chatModel from "../models/chatModel";
import { ChatMessageSchema, NewChatMessageSchema } from "../schemas/chatSchema";

export const getChatMessages = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { eventId } = req.params;
    const messages = await chatModel.getChatMessages(eventId);
    const validatedMessages = ChatMessageSchema.array().parse(messages);
    res.json(validatedMessages);
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred while fetching chat messages" });
  }
};

export const createChatMessage = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { eventId } = req.params;
    const newMessage = NewChatMessageSchema.parse({
      ...req.body,
      event_id: eventId,
    });
    const createdMessage = await chatModel.addChatMessage(newMessage);
    const validatedMessage = ChatMessageSchema.parse(createdMessage);
    res.status(201).json(validatedMessage);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res
        .status(500)
        .json({ message: "An error occurred while creating the chat message" });
    }
  }
};
