import EventForm from "@/components/EventForm";
import { fetchEvent } from "@/actions/events";
import { Spinner } from "@/components/spinner";

export default async function EditEventPage({
  params,
}: {
  params: { id: string };
}) {
  const id = parseInt(params.id, 10);
  const event = await fetchEvent(id);
  console.log(event, "event");

  if (!event) {
    return <Spinner />;
  }

  return <EventForm event={event} formType="Edit" />;
}
