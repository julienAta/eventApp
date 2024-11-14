"use client";
import React, { useCallback } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSocket } from "@/hooks/use-socket";
import { useChatMessages } from "@/hooks/use-chat-messages";

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
  token: string;
}

export function Chat({ eventId, currentUser, token }: ChatProps) {
  const handleNewMessage = useCallback((message: ChatMessage) => {
    setMessages((prev) => [...prev, message]);
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  const { socket, isConnected } = useSocket({
    token,
    eventId,
    onNewMessage: handleNewMessage,
  });

  const {
    messages,
    setMessages,
    newMessage,
    isLoading,
    scrollRef,
    setNewMessage,
    handleSendMessage,
    formatTime,
    isCurrentUserMessage,
  } = useChatMessages({
    eventId,
    token,
    currentUserId: currentUser.id,
    socket,
    isConnected,
  });

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
