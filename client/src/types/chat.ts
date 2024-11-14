export interface ChatMessage {
  id: string;
  content: string;
  event_id: number;
  user_id: string;
  created_at: string;
  user?: {
    id: string;
    name: string;
    avatar_url?: string;
  };
}

export interface ChatUser {
  id: string;
  name: string;
  avatar_url?: string;
}

export interface ChatEvent {
  id: number;
  title: string;
  creator_id: string;
}
