import React, { useState, useEffect, useRef, useCallback } from "react";
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
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  const connectSocket = useCallback(() => {
    const token = localStorage.getItem("accessToken");
    console.log("Attempting to connect to WebSocket at:", API_BASE_URL);

    const newSocket = io(API_BASE_URL, {
      auth: { token },
      transports: ["websocket", "polling"],
      reconnectionAttempts: maxReconnectAttempts,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
    });

    newSocket.on("connect", () => {
      console.log("Connected to WebSocket. Socket ID:", newSocket.id);
      setIsConnected(true);
      reconnectAttempts.current = 0;
      newSocket.emit("join_room", eventId.toString());
    });

    newSocket.on("connect_error", (error) => {
      console.error("WebSocket connection error:", error);
      setIsConnected(false);
      reconnectAttempts.current++;
      if (reconnectAttempts.current >= maxReconnectAttempts) {
        console.error(
          "Max reconnection attempts reached. Please refresh the page."
        );
      }
    });

    newSocket.on("disconnect", (reason) => {
      console.log("Disconnected from WebSocket:", reason);
      setIsConnected(false);
      if (reason === "io server disconnect") {
        // The disconnection was initiated by the server, you need to reconnect manually
        newSocket.connect();
      }
    });

    newSocket.on("new_message", (message: ChatMessage | null) => {
      console.log(
        "Received new_message event. Raw data:",
        JSON.stringify(message)
      );
      if (message && isValidChatMessage(message)) {
        console.log("Valid message received, updating state");
        setMessages((prevMessages) => {
          const messageExists = prevMessages.some((m) => m.id === message.id);
          if (!messageExists) {
            return [...prevMessages, message];
          }
          return prevMessages;
        });
      } else {
        console.warn("Received invalid or null message. Raw data:", message);
      }
    });

    newSocket.on("message_confirmation", (confirmation) => {
      console.log("Received message confirmation:", confirmation);
    });

    newSocket.on("message_error", (error) => {
      console.error("Received message error:", error);
      // Display the error message to the user, including the details if available
      alert(
        `Error sending message: ${error.message}${
          error.details ? ` (${error.details})` : ""
        }`
      );
    });

    // ... other socket event handlers ...

    setSocket(newSocket);

    return () => {
      console.log("Cleaning up WebSocket connection");
      newSocket.off("connect");
      newSocket.off("disconnect");
      newSocket.off("new_message");
      newSocket.off("message_confirmation");
      newSocket.off("message_error");
      newSocket.off("error");
      newSocket.disconnect();
    };
  }, [eventId]);

  useEffect(() => {
    const cleanup = connectSocket();
    return cleanup;
  }, [connectSocket]);

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
    if (!newMessage.trim() || !socket || !isConnected) {
      console.log("Cannot send message: Empty message or no active connection");
      return;
    }

    const messageToSend = {
      content: newMessage.trim(),
      user_id: currentUser.id,
      event_id: eventId,
    };

    // Clear the input field immediately for instant feedback
    setNewMessage("");

    try {
      console.log("Attempting to send message:", messageToSend);
      socket.emit("chat_message", messageToSend, (response: any) => {
        console.log("Received response from chat_message emit:", response);
        if (response && response.error) {
          console.error("Error sending message:", response.error);
          // Show error to user and revert the message in the input field
          setNewMessage(messageToSend.content);
          alert(`Error sending message: ${response.error}`);
        } else if (response && response.status === "ok") {
          console.log("Message sent successfully:", response);
        } else {
          console.warn("Unexpected response from server:", response);
        }
      });
    } catch (error) {
      console.error("Error sending message:", error);
      // Show error to user and revert the message in the input field
      setNewMessage(messageToSend.content);
      alert(`Error sending message: ${error}`);
    }
  };

  const isCurrentUserMessage = (message: ChatMessage): boolean => {
    return message.user_id === currentUser.id;
  };

  const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  function isValidChatMessage(message: any): message is ChatMessage {
    return (
      message !== null &&
      typeof message === "object" &&
      typeof message.id === "string" &&
      typeof message.event_id === "number" &&
      typeof message.content === "string" &&
      typeof message.created_at === "string" &&
      (typeof message.user_id === "string" || message.user_id === null)
    );
  }

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
