import { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { ChatMessage } from "@/types/chat";
interface UseSocketProps {
  token: string;
  eventId: number;
  onNewMessage: (message: ChatMessage) => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
const MAX_RECONNECT_ATTEMPTS = 5;

export const useSocket = ({ token, eventId, onNewMessage }: UseSocketProps) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const reconnectAttempts = useRef(0);

  useEffect(() => {
    let socketInstance: Socket | null = null;

    const connectSocket = () => {
      try {
        if (!token) return;

        socketInstance = io(API_URL, {
          auth: { token },
          transports: ["websocket", "polling"],
          reconnectionAttempts: MAX_RECONNECT_ATTEMPTS,
        });

        socketInstance.on("connect", () => {
          setIsConnected(true);
          reconnectAttempts.current = 0;
          socketInstance?.emit("join_room", eventId.toString());
        });

        socketInstance.on("connect_error", (error) => {
          console.error("Connection error:", error);
          setIsConnected(false);
          reconnectAttempts.current++;
        });

        socketInstance.on("new_message", onNewMessage);

        setSocket(socketInstance);
      } catch (error) {
        console.error("Socket initialization error:", error);
      }
    };

    connectSocket();

    return () => {
      if (socketInstance) {
        socketInstance.off("connect");
        socketInstance.off("disconnect");
        socketInstance.off("new_message");
        socketInstance.disconnect();
      }
    };
  }, [token, eventId, onNewMessage]);

  return {
    socket,
    isConnected,
  };
};
