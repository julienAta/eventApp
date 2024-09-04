import React, { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "./ui/scroll-area";

interface ChatMessage {
  id: string;
  event_id: number;
  user_id?: string; // Made optional to handle potential missing user_id
  content: string;
  created_at: string;
}

interface User {
  id: string;
  name: string;
}

interface ChatProps {
  eventId: number;
  currentUser: User;
}

const API_BASE_URL = "http://localhost:3000";

export function Chat({ eventId, currentUser }: ChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    console.log("Attempting to connect to WebSocket at:", API_BASE_URL);

    const newSocket = io(API_BASE_URL, {
      auth: { token },
      transports: ["websocket", "polling"],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
    });

    newSocket.on("connect", () => {
      console.log("Connected to WebSocket. Socket ID:", newSocket.id);
      setIsConnected(true);
      newSocket.emit("join_room", eventId.toString());
    });

    newSocket.on("connect_error", (error) => {
      console.error("WebSocket connection error:", error);
      setIsConnected(false);
    });

    newSocket.on("disconnect", (reason) => {
      console.log("Disconnected from WebSocket:", reason);
      setIsConnected(false);
    });

    newSocket.on("new_message", (message: ChatMessage) => {
      console.log("Received new message:", message);
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    newSocket.on("message_confirmation", (confirmation) => {
      console.log("Message confirmation received:", confirmation);
      // You can update the message status in the UI if needed
    });

    newSocket.on("message_error", (error) => {
      console.error("Message error:", error);
    });

    newSocket.on("error", (error: string) => {
      console.error("Socket error:", error);
    });

    setSocket(newSocket);

    // Implement a ping mechanism
    const pingInterval = setInterval(() => {
      if (newSocket.connected) {
        console.log("Sending ping");
        newSocket.emit("ping");
      }
    }, 5000);

    // Cleanup function
    return () => {
      console.log("Cleaning up WebSocket connection");
      clearInterval(pingInterval);
      if (newSocket) {
        newSocket.off("connect");
        newSocket.off("disconnect");
        newSocket.off("new_message");
        newSocket.off("message_confirmation");
        newSocket.off("message_error");
        newSocket.off("error");
        newSocket.disconnect();
      }
    };
  }, [eventId]);

  useEffect(() => {
    fetchMessages();
  }, [eventId]);

  const fetchMessages = async (): Promise<void> => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      console.error("No token found in localStorage");

      return;
    }
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/chat/${eventId}/messages`,
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
      setMessages(data.messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const sendMessage = async (): Promise<void> => {
    if (!newMessage.trim()) {
      console.log("Cannot send empty message");
      return;
    }

    if (!socket || !isConnected) {
      console.error("Cannot send message: No active socket connection");
      return;
    }

    const messageToSend = {
      content: newMessage.trim(),
      user_id: currentUser.id,
      event_id: eventId,
    };

    // Optimistic update
    const optimisticMessage: ChatMessage = {
      id: `temp-${Date.now()}`,
      event_id: eventId,
      user_id: currentUser.id, // Ensure user_id is always set
      content: newMessage.trim(),
      created_at: new Date().toISOString(),
    };
    setMessages((prevMessages) => [...prevMessages, optimisticMessage]);
    setNewMessage("");

    try {
      console.log("Attempting to send message:", messageToSend);
      socket.emit("chat_message", messageToSend);
    } catch (error) {
      console.error("Error sending message:", error);

      // Remove the optimistic message
      setMessages((prevMessages) =>
        prevMessages.filter((msg) => msg.id !== optimisticMessage.id)
      );
    }
  };

  const isCurrentUserMessage = (message: ChatMessage): boolean => {
    return message.user_id !== undefined && message.user_id === currentUser.id;
  };

  const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="flex flex-col h-full max-h-[61dvh] w-full mx-auto rounded-lg border overflow-hidden">
      <h2 className="text-2xl font-bold mb-4 pt-5 px-5">Event Chat</h2>

      <ScrollArea className="flex-1 p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex flex-col ${
              isCurrentUserMessage(message) ? "items-end" : "items-start"
            } space-y-2`}
          >
            <div
              className={`${
                isCurrentUserMessage(message)
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              } px-4 py-2 rounded-lg ${
                isCurrentUserMessage(message)
                  ? "rounded-br-none"
                  : "rounded-bl-none"
              } max-w-[75%]`}
            >
              <p>{message.content}</p>
            </div>
            <div className="text-xs text-muted-foreground">
              {formatTime(message.created_at)}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </ScrollArea>
      <div className="bg-muted/50 px-4 py-2 flex items-center gap-2">
        <Textarea
          value={newMessage}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setNewMessage(e.target.value)
          }
          placeholder="Type your message..."
          className="flex-1 bg-transparent border-none focus:ring-0 resize-none"
          onKeyPress={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
        />
        <Button onClick={sendMessage}>Send</Button>
      </div>
    </div>
  );
}
