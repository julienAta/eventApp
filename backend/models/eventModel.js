import { supabase } from "../supabase/supabaseClient.js";

// Get all events
export const getEvents = async () => {
  const { data, error } = await supabase.from("events").select("*");
  if (error) {
    throw new Error(error.message);
  }
  return data;
};

// Add a new event
export const addEvent = async (event) => {
  const { data, error } = await supabase.from("events").insert([event]);
  if (error) {
    throw new Error(error.message);
  }
  return data;
};

// Update an existing event
export const updateEvent = async (id, updatedEvent) => {
  const { data, error } = await supabase
    .from("events")
    .update(updatedEvent)
    .eq("id", id);
  if (error) {
    throw new Error(error.message);
  }
  return data;
};

// Delete an event
export const deleteEvent = async (id) => {
  const { data, error } = await supabase.from("events").delete().eq("id", id);
  if (error) {
    throw new Error(error.message);
  }
  return data;
};
