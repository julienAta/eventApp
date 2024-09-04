import { z } from "zod";
import { logger } from "./logger";

const messageSchema = z.object({
  content: z.string().min(1).max(1000),
  user_id: z.string().uuid(),
  event_id: z.number().int().positive(),
});

export function validateMessage(message: any) {
  logger.info("Validating message:", message);
  const result = messageSchema.safeParse(message);
  if (!result.success) {
    logger.error("Invalid message:", result.error);
    throw new Error("Invalid message format");
  }
  logger.info("Message validation successful");
  return result.data;
}
