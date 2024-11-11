import Dashboard from "@/components/dashboard";
import { supabase } from "@/lib/supabase";
import { Event } from "@/types/event";

async function getEvents(): Promise<Event[]> {
  try {
    const { data: events, error } = await supabase.from("events").select("*");

    if (error) throw error;
    return events || [];
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
}

export default async function DashboardPage() {
  const events = await getEvents();
  return <Dashboard events={events} />;
}
