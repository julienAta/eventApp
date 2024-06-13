// components/EventList.tsx
import { FC } from "react";

interface Event {
  id: string;
  title: string;
  description: string;
}

interface EventListProps {
  events: Event[];
}

const EventList: FC<EventListProps> = ({ events }) => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Events</h1>
      <ul>
        {events.map((event) => (
          <li key={event.id} className="mb-2">
            <h2 className="text-xl font-semibold">{event.title}</h2>
            <p>{event.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EventList;
