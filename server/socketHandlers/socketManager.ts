import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { supabase } from "../supabase/supabaseClient";
import { logger } from "../utils/logger";

export const initializeSocketIO = (server: any) => {
  const io = new Server(server, {
    path: "/socket.io/", // Explicit path
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true,
      allowedHeaders: ["Authorization", "Content-Type"],
    },
    transports: ["websocket", "polling"], // Enable both WebSocket and polling
  });

  // Socket authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        logger.warn("Authentication error: Token required");
        return next(new Error("Authentication error: Token required"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET!);
      socket.data.userId = (decoded as any).userId;
      logger.info(`Socket authenticated for user: ${socket.data.userId}`);
      next();
    } catch (error) {
      logger.error("Socket authentication error:", error);
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    logger.info(`New socket connection: ${socket.id}`);

    socket.on("join_room", (eventId: string) => {
      logger.info(`Socket ${socket.id} joining room ${eventId}`);
      socket.join(eventId);
      // Send confirmation back to client
      socket.emit("room_joined", { eventId });
    });

    socket.on("chat_message", async (data) => {
      try {
        if (!data.content?.trim() || !data.event_id) {
          throw new Error("Invalid message data");
        }

        const { data: message, error } = await supabase
          .from("chat_messages")
          .insert({
            content: data.content.trim(),
            event_id: data.event_id,
            user_id: socket.data.userId,
          })
          .select("*")
          .single();

        if (error) throw error;

        io.to(data.event_id.toString()).emit("new_message", message);
        socket.emit("message_confirmation", {
          status: "ok",
          messageId: message.id,
        });
      } catch (error) {
        logger.error("Error handling chat message:", error);
        socket.emit("message_error", {
          status: "error",
          message: "Failed to send message",
        });
      }
    });

    socket.on("error", (error) => {
      logger.error(`Socket ${socket.id} error:`, error);
    });

    socket.on("disconnect", (reason) => {
      logger.info(`Socket ${socket.id} disconnected: ${reason}`);
    });
  });

  return io;
};
