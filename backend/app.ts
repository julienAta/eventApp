import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import winston from "winston";
import expressWinston from "express-winston";
import { z } from "zod";
import router from "./routes/index.js";
import { errorHandler } from "./middlewares/index.js";
import { socketAuth } from "./middlewares/socketAuth.js";
import * as chatModel from "./models/chatModel.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3001",
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket", "polling"],
});

const port = process.env.PORT || 3000;

// Logger setup
const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: { service: "user-service" },
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3001",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);
app.use(express.json());

app.use(
  expressWinston.logger({
    winstonInstance: logger,
    meta: true,
    msg: "HTTP {{req.method}} {{req.url}}",
    expressFormat: true,
    colorize: false,
  })
);

app.use("/api", router);

// Message validation schema
const messageSchema = z.object({
  content: z.string().min(1).max(1000), // Adjust max length as needed
  user_id: z.string().uuid(),
  event_id: z.number().int().positive(),
});

function validateMessage(message: any) {
  logger.info("Validating message:", message);
  if (!message || typeof message !== "object") {
    logger.error("Invalid message: not an object");
    throw new Error("Invalid message format");
  }
  if (typeof message.content !== "string" || message.content.trim() === "") {
    logger.error("Invalid message: content is not a non-empty string");
    throw new Error("Message content must be a non-empty string");
  }
  if (typeof message.user_id !== "string" || message.user_id.trim() === "") {
    logger.error("Invalid message: user_id is not a non-empty string");
    throw new Error("User ID must be a non-empty string");
  }
  if (typeof message.event_id !== "number" || isNaN(message.event_id)) {
    logger.error("Invalid message: event_id is not a number");
    throw new Error("Event ID must be a number");
  }
  logger.info("Message validation successful");
  return message;
}

io.use(socketAuth);
io.on("connection", (socket) => {
  logger.info("New socket connection:", { socketId: socket.id });

  // Set up a periodic ping
  const pingInterval = setInterval(() => {
    socket.emit("ping");
  }, 25000); // Every 25 seconds

  socket.on("pong", () => {
    logger.debug("Received pong from", { socketId: socket.id });
  });

  socket.on("join_room", (roomId) => {
    logger.info(`Socket joining room`, { socketId: socket.id, roomId });
    socket.join(roomId);
    logger.info(`Socket joined room`, { socketId: socket.id, roomId });
  });

  socket.on("chat_message", async (message) => {
    logger.info("Received chat message:", { message });
    try {
      logger.info("Attempting to validate message");
      const validatedMessage = validateMessage(message);
      logger.info("Validated message:", { validatedMessage });

      let storedMessage;
      try {
        logger.info("Attempting to store message in database");
        storedMessage = await chatModel.addChatMessage(validatedMessage);
        logger.info("Stored message result:", { storedMessage });
      } catch (dbError) {
        logger.error("Error storing or fetching message in database:", dbError);
        throw dbError;
      }

      if (storedMessage) {
        logger.info("Message stored successfully:", { storedMessage });

        // Broadcast the message to all clients in the room, including the sender
        logger.info("Attempting to broadcast message to room", {
          room: validatedMessage.event_id.toString(),
          message: storedMessage,
        });
        io.to(validatedMessage.event_id.toString()).emit(
          "new_message",
          storedMessage
        );
        logger.info("Message broadcasted");

        // Send confirmation only to the sender
        socket.emit("message_confirmation", {
          status: "ok",
          id: storedMessage.id,
        });
        logger.info("Confirmation sent to sender");
      } else {
        throw new Error(
          "Failed to store or fetch message: Unexpected null result"
        );
      }
    } catch (error) {
      logger.error("Error in chat_message handler:", error);
      if (error instanceof Error) {
        logger.error("Error processing chat message", {
          error: error.message,
          stack: error.stack,
          messageContent: message.content,
          userId: message.user_id,
          eventId: message.event_id,
        });
        socket.emit("message_error", {
          status: "error",
          message: "Failed to process message. Please try again.",
          details: error.message, // Include more details about the error
        });
      } else {
        logger.warn("Rate limit exceeded for user", { socketId: socket.id });
        socket.emit("message_error", {
          status: "error",
          message: "You're sending messages too quickly. Please slow down.",
        });
      }
    }
  });

  socket.on("disconnect", (reason) => {
    logger.info("Socket disconnected:", { socketId: socket.id, reason });
    clearInterval(pingInterval);
    // You might want to handle cleanup here, like removing the user from rooms
  });

  socket.on("reconnect", (attemptNumber) => {
    logger.info("Socket reconnected:", { socketId: socket.id, attemptNumber });
    // You might want to re-join rooms or re-sync data here
  });

  socket.on("reconnect_error", (error) => {
    logger.error("Reconnection error:", { socketId: socket.id, error });
  });
});

server.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});

export { logger };
