import EventList from "../../components/EventList";
import { FC } from "react";

const fetchEvents = async () => {
  const res = await fetch("http://localhost:3000/api/events");
  if (!res.ok) {
    throw new Error("Failed to fetch events");
  }
  return res.json();
};

const EventsPage: FC = async () => {
  const events = await fetchEvents();
  console.log(events, "events");

  return <EventList events={events} />;
};

export default EventsPage;
