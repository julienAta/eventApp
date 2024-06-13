import { EventDetail } from "@/components/component/event-detail";
import { fetchEvent } from "@/actions/events";

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
