import { z } from "zod";

export const ChatMessageSchema = z.object({
  id: z.string().uuid(),
  event_id: z.string().uuid(),
  user_id: z.string().uuid(),
  content: z.string().min(1),
  created_at: z.string().datetime(),
});

export const NewChatMessageSchema = ChatMessageSchema.omit({
  id: true,
  created_at: true,
});

export type ChatMessage = z.infer<typeof ChatMessageSchema>;
export type NewChatMessage = z.infer<typeof NewChatMessageSchema>;
