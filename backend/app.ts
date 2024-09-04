import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import winston from "winston";
import expressWinston from "express-winston";
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

io.use(socketAuth);
io.on("connection", (socket) => {
  console.log("New socket connection:", socket.id);

  socket.on("join_room", (roomId) => {
    console.log(`Socket ${socket.id} joining room ${roomId}`);
    socket.join(roomId);
  });

  socket.on("chat_message", async (message) => {
    console.log("Received chat message:", message);
    try {
      // Validate the message (you may want to add more validation)
      if (!message.content || !message.user_id || !message.event_id) {
        throw new Error("Invalid message format");
      }

      // Store the message in Supabase
      const storedMessage = await chatModel.addChatMessage(message);

      // Broadcast the stored message to all clients in the room
      io.to(message.event_id.toString()).emit("new_message", storedMessage);

      // Send a confirmation to the sender
      socket.emit("message_confirmation", {
        status: "ok",
        id: storedMessage.id,
      });
    } catch (error) {
      logger.error("Error processing chat message", { error, message });
      socket.emit("message_error", {
        status: "error",
        message: "Failed to process message",
      });
    }
  });

  socket.on("disconnect", (reason) => {
    console.log("Socket disconnected:", socket.id, "Reason:", reason);
  });
});

server.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});
export { logger };
