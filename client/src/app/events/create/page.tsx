import EventForm from "@/components/EventForm";
import { getUser } from "@/lib/authService";

const CreateEventPage = async () => {
  const user = await getUser();
  return <EventForm formType="Create" user={user} />;
};

export default CreateEventPage;
