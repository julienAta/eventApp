import EventForm from "../../../../components/EventForm";

const fetchEvent = async (id: number) => {
  const res = await fetch(`http://localhost:3000/api/events/${id}`);
  const data = await res.json();
  return data;
};
const EditEventPage = async ({ params }: { params: { id: number } }) => {
  const { id } = params;
  const event = await fetchEvent(id);

  if (!event) {
    return <p>Loading...</p>;
  }

  return <EventForm event={event} formType="Edit" />;
};

export default EditEventPage;
