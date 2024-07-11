import { supabase } from "../supabase/supabaseClient";
import { ChatMessage, NewChatMessage } from "../types/chatTypes";

export const getChatMessages = async (
  eventId: string
): Promise<ChatMessage[]> => {
  const { data, error } = await supabase
    .from("chat_messages")
    .select("*")
    .eq("event_id", eventId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data as ChatMessage[];
};

export const addChatMessage = async (
  message: NewChatMessage
): Promise<ChatMessage> => {
  const { data, error } = await supabase
    .from("chat_messages")
    .insert(message)
    .select()
    .single();

  if (error) throw error;
  return data as ChatMessage;
};
