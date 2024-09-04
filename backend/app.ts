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

  socket.on("chat_message", (message) => {
    console.log("Received chat message:", message);
    io.to(message.event_id.toString()).emit("new_message", message);
  });

  socket.on("disconnect", (reason) => {
    console.log("Socket disconnected:", socket.id, "Reason:", reason);
  });
});
server.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});
export { logger };
