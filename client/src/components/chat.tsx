// components/Chat.tsx
import React, { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ChatMessage {
  id: string;
  content: string;
  event_id: number;
  user_id: string;
  created_at: string;
}

interface ChatProps {
  eventId: number;
  currentUser: {
    id: string;
    name: string;
  };
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export function Chat({ eventId, currentUser }: ChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Initialize socket connection
  useEffect(() => {
    let socketInstance: Socket | null = null;

    const connectSocket = () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          return;
        }

        socketInstance = io(API_URL, {
          auth: {
            token,
          },
          transports: ["websocket", "polling"],
          reconnectionAttempts: maxReconnectAttempts,
        });

        socketInstance.on("connect", () => {
          console.log("Connected to chat server");
          setIsConnected(true);
          reconnectAttempts.current = 0;
          socketInstance?.emit("join_room", eventId.toString());
        });

        socketInstance.on("connect_error", (error) => {
          console.error("Connection error:", error);
          setIsConnected(false);
          reconnectAttempts.current++;

          if (reconnectAttempts.current >= maxReconnectAttempts) {
          }
        });

        socketInstance.on("new_message", (message: ChatMessage) => {
          setMessages((prev) => [...prev, message]);
          scrollToBottom();
        });

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
  }, [eventId]);

  // Fetch message history
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("accessToken");

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
        scrollToBottom();
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, [eventId]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !socket || !isConnected) return;

    try {
      console.log("Sending message:", newMessage);
      console.log("Event ID:", eventId);
      console.log("User ID:", currentUser.id);

      socket.emit("chat_message", {
        content: newMessage.trim(),
        event_id: eventId,
        user_id: currentUser.id,
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
    return message.user_id === currentUser.id;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[61dvh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full max-h-[61dvh] w-full mx-auto rounded-lg border overflow-hidden bg-background">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-xl font-semibold">Chat</h2>
        <div
          className={`text-sm ${
            isConnected ? "text-green-500" : "text-yellow-500"
          }`}
        >
          {isConnected ? "Connected" : "Connecting..."}
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex flex-col ${
                isCurrentUserMessage(message) ? "items-end" : "items-start"
              } space-y-1`}
            >
              <div
                className={`px-4 py-2 rounded-lg max-w-[75%] ${
                  isCurrentUserMessage(message)
                    ? "bg-primary text-primary-foreground rounded-br-none"
                    : "bg-muted text-muted-foreground rounded-bl-none"
                }`}
              >
                <p className="break-words">{message.content}</p>
              </div>
              <span className="text-xs text-muted-foreground">
                {formatTime(message.created_at)}
              </span>
            </div>
          ))}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      <div className="border-t p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex gap-2"
        >
          <Textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 min-h-[2.5rem] max-h-[10rem]"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <Button
            type="submit"
            disabled={!newMessage.trim() || !isConnected}
            className="self-end"
          >
            Send
          </Button>
        </form>
      </div>
    </div>
  );
}
