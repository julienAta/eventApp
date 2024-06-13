import { supabase } from "../supabase/supabaseClient.js";

export const getEvents = async () => {
  const { data, error } = await supabase.from("events").select("*");
  if (error) {
    throw new Error(error.message);
  }
  return data;
};

export const addEvent = async (event) => {
  const { data, error } = await supabase.from("events").insert([event]);
  if (error) {
    throw new Error(error.message);
  }
  return data;
};

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

export const deleteEvent = async (id) => {
  const { data, error } = await supabase.from("events").delete().eq("id", id);
  if (error) {
    throw new Error(error.message);
  }
  return data;
};
