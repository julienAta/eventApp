import EventForm from "@/components/EventForm";
import { fetchEvent } from "@/actions/events";
import { Spinner } from "@/components/spinner";

const EditEventPage = async ({ params }: { params: { id: number } }) => {
  const { id } = params;
  const event = await fetchEvent(id);

  if (!event) {
    return <Spinner />;
  }

  return <EventForm event={event} formType="Edit" />;
};

export default EditEventPage;
