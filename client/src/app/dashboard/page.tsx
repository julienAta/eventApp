import Dashboard from "@/components/dashboard";
import { getUser } from "@/lib/authService";
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
  const user = await getUser();
  if (!user) return <div>You are not authorized to access this page</div>;
  return <Dashboard events={events} user={user} />;
}
