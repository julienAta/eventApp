import { log } from "winston";
import { supabase } from "../supabase/supabaseClient.js";
import { Event, NewEvent } from "../types/eventTypes.js";
import { getExpensesByEventId } from "./expenseModel.js";

export const getEvents = async (): Promise<Event[]> => {
  const { data, error } = await supabase.from("events").select("*");

  if (error) {
    throw new Error(error.message);
  }
  const eventsWithExpenses = await Promise.all(
    data.map(async (event) => {
      const expenses = await getExpensesByEventId(event.id);
      return { ...event, expenses: expenses.map((e) => e.id) };
    })
  );
  return eventsWithExpenses;
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
