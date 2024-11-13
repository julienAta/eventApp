import EventForm from "@/components/EventForm";
import { getUser } from "@/lib/authService";
import { cookies } from "next/headers";

const CreateEventPage = async () => {
  const user = await getUser();
  const token = cookies().get("accessToken");
  if (!user) {
    return <div>Loading...</div>;
  }
  if (!token) {
    return <div>Loading...</div>;
  }
  return <EventForm formType="Create" user={user} token={token} />;
};

export default CreateEventPage;
