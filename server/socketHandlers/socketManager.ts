import { Server, Socket } from "socket.io";
import { handleChatMessage, handleJoinRoom } from "./chatHandlers";
import { socketAuth } from "../middlewares/socketAuth";
import { logger } from "../utils/logger";

export const initializeSocketIO = (server: any) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:3001",
      methods: ["GET", "POST"],
      credentials: true,
    },
    transports: ["websocket", "polling"],
  });

  io.use(socketAuth);

  io.on("connection", (socket: Socket) => {
    logger.info("New socket connection:", { socketId: socket.id });

    const pingInterval = setInterval(() => {
      socket.emit("ping");
    }, 25000);

    socket.on("pong", () => {
      logger.debug("Received pong from", { socketId: socket.id });
    });

    socket.on("join_room", (roomId: string) => handleJoinRoom(socket, roomId));

    socket.on("chat_message", (message: any) =>
      handleChatMessage(io, socket, message)
    );

    socket.on("disconnect", (reason) => {
      logger.info("Socket disconnected:", { socketId: socket.id, reason });
      clearInterval(pingInterval);
    });
  });

  return io;
};
