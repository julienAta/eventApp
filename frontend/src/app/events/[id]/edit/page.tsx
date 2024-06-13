import EventForm from "@/components/EventForm";
import { fetchEvent } from "@/actions/events";

const EditEventPage = async ({ params }: { params: { id: number } }) => {
  const { id } = params;
  const event = await fetchEvent(id);

  if (!event) {
    return <p>Loading...</p>;
  }

  return <EventForm event={event} formType="Edit" />;
};

export default EditEventPage;
