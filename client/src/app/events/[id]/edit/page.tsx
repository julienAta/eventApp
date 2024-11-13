import { fetchEvent } from "@/actions/events";
import { Spinner } from "@/components/spinner";
import { getUser } from "@/lib/auth-service";
import EventForm from "@/components/event-form";
import { cookies } from "next/headers";
export default async function EditEventPage({
  params,
}: {
  params: { id: number };
}) {
  const id = params.id;
  const event = await fetchEvent(id);
  const user = await getUser();
  const token = cookies().get("accessToken");
  if (!token) return <div>You are not authorized to access this page</div>;

  if (!user) return <div>You are not authorized to access this page</div>;
  if (!event) {
    return <Spinner />;
  }

  return <EventForm event={event} formType="Edit" user={user} token={token} />;
}
