import { Socket } from "socket.io";
import { logger } from "../utils/logger";
import * as chatModel from "../models/chatModel";
import { validateMessage } from "../utils/validators";

export const handleChatMessage = async (
  io: any,
  socket: Socket,
  message: any
) => {
  logger.info("Received chat message:", { message });
  try {
    const validatedMessage = validateMessage(message);
    const storedMessage = await chatModel.addChatMessage(validatedMessage);

    if (storedMessage) {
      logger.info("Message stored successfully:", { storedMessage });
      io.to(validatedMessage.event_id.toString()).emit(
        "new_message",
        storedMessage
      );
      socket.emit("message_confirmation", {
        status: "ok",
        id: storedMessage.id,
      });
    } else {
      throw new Error(
        "Failed to store or fetch message: Unexpected null result"
      );
    }
  } catch (error) {
    logger.error("Error in chat_message handler:", error);
    socket.emit("message_error", {
      status: "error",
      message: "Failed to process message. Please try again.",
      details: error instanceof Error ? error.message : undefined,
    });
  }
};

export const handleJoinRoom = (socket: Socket, roomId: string) => {
  logger.info(`Socket joining room`, { socketId: socket.id, roomId });
  socket.join(roomId);
  logger.info(`Socket joined room`, { socketId: socket.id, roomId });
};
