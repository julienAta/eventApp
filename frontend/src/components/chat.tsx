import React, { useState, useEffect, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "./ui/scroll-area";

interface ChatMessage {
  id: string;
  event_id: number;
  user_id: string;
  content: string;
  created_at: string;
}

interface ChatMessageResponse {
  messages: ChatMessage[];
}

interface User {
  id: string;
  name: string;
}

interface ChatProps {
  eventId: number;
  currentUser: User;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_NEXT_PUBLIC_BACKEND_URL ||
  "http://localhost:3000/api";

export function Chat({ eventId, currentUser }: ChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMessages();
    const eventSource = new EventSource(
      `${API_BASE_URL}/chat/${eventId.toString()}/stream`
    );

    eventSource.onmessage = (event) => {
      const newMessage = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    };

    return () => {
      eventSource.close();
    };
  }, [eventId]);

  // useEffect(() => {
  //   scrollToBottom();
  // }, [messages]);

  const fetchMessages = async (): Promise<void> => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `${API_BASE_URL}/chat/${eventId.toString()}/messages`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data: ChatMessageResponse = await response.json();
      setMessages(data.messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const sendMessage = async (): Promise<void> => {
    if (!newMessage.trim()) return;
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `${API_BASE_URL}/chat/${eventId.toString()}/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            content: newMessage.trim(),
            user_id: currentUser.id,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      setNewMessage("");
      fetchMessages(); // Fetch messages again to get the latest ones
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const scrollToBottom = (): void => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="flex flex-col h-full max-h-[61dvh] w-full max-w-md mx-auto bg-background rounded-lg shadow-lg border overflow-hidden">
      <h2 className="text-2xl font-bold mb-4 pt-5 px-5">Event Chat</h2>

      <ScrollArea className="flex-1 p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex flex-col ${
              message.user_id === currentUser.id ? "items-end" : "items-start"
            } space-y-2`}
          >
            <div
              className={`${
                message.user_id === currentUser.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              } px-4 py-2 rounded-lg ${
                message.user_id === currentUser.id
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
