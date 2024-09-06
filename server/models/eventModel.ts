import { drizzle } from "drizzle-orm/postgres-js";
import { supabase } from "../supabase/supabaseClient.js";
import { Event, NewEvent } from "../types/eventTypes.js";
import { getExpensesByEventId } from "./expenseModel.js";
import { events } from "../db/schema.js";
import postgres from "postgres";
const client = postgres(process.env.SUPABASE_URL!);
const db = drizzle(client);
export const getEvents = async (): Promise<Event[]> => {
  try {
    const eventsData = await db.select().from(events);

    const eventsWithExpenses = await Promise.all(
      eventsData.map(async (event) => {
        const expenses = await getExpensesByEventId(event.id);
        return {
          ...event,
          expenses: expenses.map((e) => e.id),
          description: event.description || null,
          title: event.name,
        };
      })
    );

    return eventsWithExpenses;
  } catch (error) {
    console.error("Error fetching events:", error);
    throw new Error("Failed to fetch events");
  }
};

export const addEvent = async (event: NewEvent): Promise<Event> => {
  const { data, error } = await supabase
    .from("events")
    .insert(event) // Changed from [event] to event
    .select()
    .single(); // Added .single() to return a single object
  if (error) {
    throw new Error(error.message);
  }
  return data; // This will now return a single Event object, not an array
};
export const updateEvent = async (
  id: string,
  updatedEvent: Partial<Event>
): Promise<Event | null> => {
  const { data, error } = await supabase
    .from("events")
    .update(updatedEvent)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }
  return data;
};

export const deleteEvent = async (id: string): Promise<void> => {
  const { error } = await supabase.from("events").delete().eq("id", id);
  if (error) {
    throw new Error(error.message);
  }
};
