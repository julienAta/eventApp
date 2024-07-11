export interface ChatMessage {
  id: string;
  event_id: string;
  user_id: string;
  content: string;
  created_at: string;
}

export interface NewChatMessage {
  event_id: string;
  user_id: string;
  content: string;
}
