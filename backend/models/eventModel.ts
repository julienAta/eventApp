import { supabase } from "../supabase/supabaseClient";
import { Event, NewEvent } from "../types/eventTypes";

export const getEvents = async (): Promise<Event[]> => {
  const { data, error } = await supabase.from("events").select("*");
  if (error) {
    throw new Error(error.message);
  }
  return data || [];
};

export const addEvent = async (event: NewEvent): Promise<Event[]> => {
  const { data, error } = await supabase
    .from("events")
    .insert([event])
    .select();
  if (error) {
    throw new Error(error.message);
  }
  return data || [];
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
