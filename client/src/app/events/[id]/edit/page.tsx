import EventForm from "@/components/EventForm";
import { fetchEvent } from "@/actions/events";
import { Spinner } from "@/components/spinner";

export default async function EditEventPage({
  params,
}: {
  params: { id: number };
}) {
  const id = params.id;
  const event = await fetchEvent(id);

  if (!event) {
    return <Spinner />;
  }

  return <EventForm event={event} formType="Edit" />;
}
