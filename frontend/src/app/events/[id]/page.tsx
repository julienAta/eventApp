import { EventDetail } from "@/components/component/event-detail";

const fetchEvent = async (id: number) => {
  const res = await fetch(`http://localhost:3000/api/events/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();
  return data;
};

export default async function EventDetailPage({
  params,
}: {
  params: { id: number };
}) {
  const id = params.id;

  const event = await fetchEvent(id);

  if (!event) {
    return <p>Loading...</p>;
  }

  return <EventDetail event={event} />;
}
