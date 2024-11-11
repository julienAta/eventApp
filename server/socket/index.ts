import { Server } from "socket.io";
import { createServer } from "http";
import express from "express";
import jwt from "jsonwebtoken";
import cors from "cors";
import { supabase } from "../supabase/supabaseClient";
const app = express();
const httpServer = createServer(app);

// Enable CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

// Initialize Socket.IO with CORS configuration
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Middleware to authenticate Socket.IO connections
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error("Authentication error: Token required"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    socket.data.userId = (decoded as any).userId;
    next();
  } catch (error) {
    next(new Error("Authentication error"));
  }
});

// Store active connections
const activeConnections = new Map();

io.on("connection", (socket) => {
  console.log("New connection:", socket.id);

  // Join a chat room (event)
  socket.on("join_room", (eventId: string) => {
    console.log(`Socket ${socket.id} joining room ${eventId}`);
    socket.join(eventId);
  });

  // Handle chat messages
  socket.on("chat_message", async (data) => {
    try {
      // Validate message data
      if (!data.content || !data.event_id) {
        throw new Error("Invalid message data");
      }

      // Store message in database
      const { data: message, error } = await supabase
        .from("chat_messages")
        .insert({
          content: data.content,
          event_id: data.event_id,
          user_id: socket.data.userId,
        })
        .select("*")
        .single();

      if (error) throw error;

      // Broadcast message to room
      io.to(data.event_id.toString()).emit("new_message", message);

      // Send confirmation to sender
      socket.emit("message_confirmation", {
        status: "ok",
        messageId: message.id,
      });
    } catch (error) {
      console.error("Error handling chat message:", error);
      socket.emit("message_error", {
        status: "error",
        message: "Failed to send message",
      });
    }
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
    activeConnections.delete(socket.id);
  });
});

// API endpoint to fetch chat history
app.get("/api/chat/:eventId/messages", async (req, res) => {
  try {
    const { eventId } = req.params;
    const { data: messages, error } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("event_id", eventId)
      .order("created_at", { ascending: true });

    if (error) throw error;

    res.json({ messages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
