import { z } from "zod";

export const UserSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.string().default("default"),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export const NewUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.string().default("default"),
});

export const UpdateUserSchema = NewUserSchema.partial();
