import EventForm from "@/components/EventForm";
import { fetchEvent } from "@/actions/events";
import { Spinner } from "@/components/spinner";
import { getUser } from "@/lib/authService";

export default async function EditEventPage({
  params,
}: {
  params: { id: number };
}) {
  const id = params.id;
  const event = await fetchEvent(id);
  const user = await getUser();

  if (!user) return <div>You are not authorized to access this page</div>;
  if (!event) {
    return <Spinner />;
  }

  return <EventForm event={event} formType="Edit" user={user} />;
}
