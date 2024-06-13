import EventForm from "../../../../components/EventForm";

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
const EditEventPage = async ({ params }: { params: { id: number } }) => {
  const { id } = params;
  const event = await fetchEvent(id);

  if (!event) {
    return <p>Loading...</p>;
  }

  return <EventForm event={event} formType="Edit" />;
};

export default EditEventPage;
