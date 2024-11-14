import { useState, useEffect, useRef } from "react";
import { Socket } from "socket.io-client";
import { ChatMessage } from "@/types/chat";

interface UseChatMessagesProps {
  eventId: number;
  token: string;
  socket: Socket | null;
  isConnected: boolean;
  currentUserId: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export const useChatMessages = ({
  eventId,
  token,
  socket,
  isConnected,
  currentUserId,
}: UseChatMessagesProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setIsLoading(true);
        if (!token) {
          throw new Error("No authentication token found");
        }

        const response = await fetch(
          `${API_URL}/api/chat/${eventId}/messages`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setMessages(data.messages || []);
        if (scrollRef.current) {
          scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, [eventId, token]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !socket || !isConnected) return;

    try {
      socket.emit("chat_message", {
        content: newMessage.trim(),
        event_id: eventId,
        user_id: currentUserId,
      });

      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isCurrentUserMessage = (message: ChatMessage) => {
    return message.user_id === currentUserId;
  };

  return {
    messages,
    setMessages,
    newMessage,
    isLoading,
    scrollRef,
    setNewMessage,
    handleSendMessage,
    formatTime,
    isCurrentUserMessage,
  };
};
