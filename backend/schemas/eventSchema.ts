import { z } from "zod";

export const EventSchema = z.object({
  id: z.number(),
  title: z.string().min(1),
  date: z.string(),
  description: z.string().optional(),
  location: z.string(),
  image_url: z.string().optional(),
});

export const NewEventSchema = EventSchema.omit({ id: true });

export type Event = z.infer<typeof EventSchema>;
export type NewEvent = z.infer<typeof NewEventSchema>;
