import { EventList } from "@/components/event-list";
import { fetchEvents } from "@/actions/events";

const EventsPage = async () => {
  const events = await fetchEvents();

  return <EventList events={events} />;
};

export default EventsPage;
