import { supabase } from "../supabase/supabaseClient.js";
import { logger } from "../utils/logger.js";

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
  try {
    logger.info("Attempting to insert message into database:", message);
    const { data, error } = await supabase
      .from("chat_messages")
      .insert(message)
      .select()
      .single();

    if (error) {
      logger.error("Error adding chat message to database", { error, message });
      throw new Error(
        `Failed to add chat message to database: ${error.message}`
      );
    }

    if (!data) {
      logger.warn(
        "No data returned from database insert, attempting to fetch the inserted message"
      );
      const { data: fetchedData, error: fetchError } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("event_id", message.event_id)
        .eq("user_id", message.user_id)
        .eq("content", message.content)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (fetchError) {
        logger.error("Error fetching inserted message", {
          fetchError,
          message,
        });
        throw new Error(
          `Failed to fetch inserted message: ${fetchError.message}`
        );
      }

      if (!fetchedData) {
        logger.error("Failed to fetch inserted message", { message });
        throw new Error("Failed to fetch inserted message");
      }

      logger.info("Successfully fetched inserted message:", fetchedData);
      return fetchedData as ChatMessage;
    }

    logger.info("Message successfully inserted into database:", data);
    return data as ChatMessage;
  } catch (error) {
    logger.error("Unexpected error in addChatMessage", { error, message });
    throw error;
  }
};
