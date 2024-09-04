import { supabase } from "../supabase/supabaseClient.js";
import { logger } from "../app.js";

interface ChatMessage {
  id: string;
  event_id: number;
  user_id: string;
  content: string;
  created_at: string;
}

export const getChatMessages = async (
  eventId: string
): Promise<ChatMessage[]> => {
  const { data, error } = await supabase
    .from("chat_messages")
    .select("*")
    .eq("event_id", eventId)
    .order("created_at", { ascending: true });

  if (error) {
    logger.error("Error fetching chat messages", { error, eventId });
    throw new Error("Failed to fetch chat messages");
  }

  return data as ChatMessage[];
};

export const addChatMessage = async (
  message: Omit<ChatMessage, "id" | "created_at">
): Promise<ChatMessage> => {
  const { data, error } = await supabase
    .from("chat_messages")
    .insert(message)
    .single();

  if (error) {
    logger.error("Error adding chat message", { error, message });
    throw new Error("Failed to add chat message");
  }

  return data as ChatMessage;
};
