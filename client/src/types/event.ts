import { z } from "zod";

export const EventSchema = z.object({
  id: z.number(),
  title: z.string().min(1),
  date: z.string(),
  description: z.string().optional(),
  location: z.string(),
  users: z.array(z.string()).default([]),
  creator_id: z.string(),
  image_url: z.string().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
  profiles: z
    .object({
      name: z.string(),
    })
    .optional(),
});

export const NewEventSchema = EventSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
  profiles: true,
});

export type Event = z.infer<typeof EventSchema>;

export type NewEvent = z.infer<typeof NewEventSchema>;
export type EventWithProfile = Event & {
  profiles: {
    name: string;
  };
};
