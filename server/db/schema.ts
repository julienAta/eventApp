import {
  pgTable,
  serial,
  integer,
  text,
  numeric,
  timestamp,
} from "drizzle-orm/pg-core";

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  title: text("title").notNull(),
  date: text("date").notNull(),
  location: text("location").notNull(),
  description: text("description"),
});

export const expenses = pgTable("expenses", {
  id: serial("id").primaryKey(),
  event_id: integer("event_id").notNull(),
  description: text("description").notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  date: timestamp("date").notNull(),
  paid_by: text("paid_by").notNull(),
});
