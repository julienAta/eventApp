"use client";

import { Button } from "@/components/ui/button";
import { CalendarIcon, LocateIcon, UserPlus, UserMinus } from "lucide-react";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Event } from "@/types/event";
import { supabase } from "@/lib/supabase";

interface User {
  id: string;
  name: string;
}

interface EventDetailProps {
  event: Event;
  currentUser: User;
}

export function EventDetail({ event, currentUser }: EventDetailProps) {
  const router = useRouter();
  const isParticipant = event.users?.includes(currentUser.id) || false;
  const participantsCount = event.users?.length || 0;

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from("events")
        .delete()
        .eq("id", event.id);

      if (error) throw error;

      toast("Event deleted successfully");
      router.push("/events");
      router.refresh();
    } catch (error) {
      toast("Failed to delete the event.");
      console.error("Error deleting event:", error);
    }
  };

  const handleJoinEvent = async () => {
    try {
      const { data: currentEvent, error: fetchError } = await supabase
        .from("events")
        .select("users")
        .eq("id", event.id)
        .single();

      if (fetchError) throw fetchError;

      const currentUsers = currentEvent.users || [];
      if (currentUsers.includes(currentUser.id)) {
        toast("You're already a participant!");
        return;
      }

      const updatedUsers = [...currentUsers, currentUser.id];

      const { error: updateError } = await supabase
        .from("events")
        .update({ users: updatedUsers })
        .eq("id", event.id);

      if (updateError) throw updateError;

      toast("Successfully joined the event!");
      router.refresh();
    } catch (error) {
      console.error("Error joining event:", error);
      toast("Failed to join the event.");
    }
  };

  const handleUnjoinEvent = async () => {
    try {
      const { data: currentEvent, error: fetchError } = await supabase
        .from("events")
        .select("users")
        .eq("id", event.id)
        .single();

      if (fetchError) throw fetchError;

      const updatedUsers = (currentEvent.users || []).filter(
        (id: string) => id !== currentUser.id
      );

      const { error: updateError } = await supabase
        .from("events")
        .update({ users: updatedUsers })
        .eq("id", event.id);

      if (updateError) throw updateError;

      toast("Successfully left the event!");
      router.refresh();
    } catch (error) {
      console.error("Error leaving event:", error);
      toast("Failed to leave the event.");
    }
  };

  return (
    <Card className="mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <CardTitle className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mb-4">
            {event.title}
          </CardTitle>
          <CardDescription className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            {event.description}
          </CardDescription>
          <div className="flex items-center space-x-4 mb-8">
            <div className="flex items-center space-x-2">
              <CalendarIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              <span className="text-gray-600 dark:text-gray-400">
                {new Date(event.date).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <LocateIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              <span className="text-gray-600 dark:text-gray-400">
                {event.location}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-4 mb-8">
            <span className="text-sm text-gray-500">
              {participantsCount} participant
              {participantsCount !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="flex flex-wrap gap-4">
            {!isParticipant ? (
              <Button
                onClick={handleJoinEvent}
                className="flex items-center gap-2"
              >
                <UserPlus className="h-4 w-4" />
                Join Event
              </Button>
            ) : (
              <Button
                onClick={handleUnjoinEvent}
                variant="outline"
                className="flex items-center gap-2"
              >
                <UserMinus className="h-4 w-4" />
                Leave Event
              </Button>
            )}
            {event.creator_id === currentUser.id && (
              <>
                <Link href={`/events/${event.id}/edit`}>
                  <Button>Update Details</Button>
                </Link>
                <Button onClick={handleDelete} variant="destructive">
                  Delete
                </Button>
              </>
            )}
          </div>
        </div>
        <div>
          <img
            alt="Event Image"
            className="rounded-lg object-cover w-full h-full"
            height="400"
            src="/placeholder.svg"
            style={{
              aspectRatio: "600/400",
              objectFit: "cover",
            }}
            width="600"
          />
        </div>
      </div>
    </Card>
  );
}
