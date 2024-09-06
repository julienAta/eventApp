import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const events = pgTable("events", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  title: text("title").notNull(), // Add this line if 'title' is a separate field
  date: timestamp("date").notNull(),
  location: text("location").notNull(),
  description: text("description"),
});
