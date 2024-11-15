export const revalidate = 0;
import { EventList } from "@/components/event-list";
import { fetchEvents } from "@/actions/events";
const EventsPage = async () => {
  const events = await fetchEvents();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Upcoming Events</h1>
      <EventList events={events} />
    </div>
  );
};

export default EventsPage;
