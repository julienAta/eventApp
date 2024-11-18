import { EventDetail } from "@/components/event-detail";
import { Chat } from "@/components/chat";
import ExpenseManager from "@/components/expense-manager";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/lib/supabase";
import { Event } from "@/types/event";
import { getUser } from "@/lib/auth-service";
import { getAccessToken } from "@/lib/auth-service";

async function getEvent(id: number): Promise<Event> {
  try {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error("Event not found");
    }

    return data;
  } catch (error) {
    console.error("Error fetching event:", error);
    throw error;
  }
}

export default async function EventDetailPage({
  params,
}: {
  params: { id: number };
}) {
  const user = await getUser();
  const event = await getEvent(params.id);
  const eventParticipants = event.users;
  const accessToken = await getAccessToken();
  const isParticipant = eventParticipants?.includes(user.id);
  const isCreator = event.creator_id === user.id;
  const canAccessFeatures = isParticipant || isCreator;

  if (!accessToken) {
    return <div>You are not authorized to access this page</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 h-full w-full">
      <div className="flex flex-wrap -mx-4 h-full w-full">
        <div className="w-full px-4 mb-8">
          <EventDetail event={event} currentUser={user} />
        </div>

        {!canAccessFeatures && (
          <div className="w-full px-4 mb-8">
            <Alert>
              <AlertDescription>
                Join this event to access the chat and expense management
                features.
              </AlertDescription>
            </Alert>
          </div>
        )}

        {canAccessFeatures && (
          <>
            <div className="w-full md:w-1/2 px-4 mb-8 md:mb-0">
              <Chat
                token={accessToken}
                eventId={params.id}
                currentUser={user}
              />
            </div>
            <div className="w-full md:w-1/2 px-4">
              <ExpenseManager
                participants={eventParticipants}
                eventId={params.id}
                currentUser={user}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
