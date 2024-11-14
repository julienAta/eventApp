import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Event } from "@/types/event";

interface User {
  id: string;
  name: string;
  avatar_url?: string;
}

interface EventManagementState {
  isDeleting: boolean;
  isJoining: boolean;
}

export const useEventManagement = (event: Event, currentUser: User) => {
  const router = useRouter();
  const [state, setState] = useState<EventManagementState>({
    isDeleting: false,
    isJoining: false,
  });

  const handleDelete = async () => {
    try {
      setState((prev) => ({ ...prev, isDeleting: true }));
      const { error } = await supabase
        .from("events")
        .delete()
        .eq("id", event.id);

      if (error) throw error;

      toast.success("Event successfully deleted");
      router.push("/events");
      router.refresh();
    } catch (error) {
      toast.error("Failed to delete the event");
      console.error("Error deleting event:", error);
    } finally {
      setState((prev) => ({ ...prev, isDeleting: false }));
    }
  };

  const handleJoinEvent = async () => {
    try {
      setState((prev) => ({ ...prev, isJoining: true }));
      const { data: currentEvent, error: fetchError } = await supabase
        .from("events")
        .select("users")
        .eq("id", event.id)
        .single();

      if (fetchError) throw fetchError;

      const currentUsers = currentEvent.users || [];
      if (currentUsers.includes(currentUser.id)) {
        toast.error("You're already a participant!");
        return;
      }

      const updatedUsers = [...currentUsers, currentUser.id];

      const { error: updateError } = await supabase
        .from("events")
        .update({ users: updatedUsers })
        .eq("id", event.id);

      if (updateError) throw updateError;

      toast.success("Successfully joined the event!");
      router.refresh();
    } catch (error) {
      toast.error("Failed to join the event");
      console.error("Error joining event:", error);
    } finally {
      setState((prev) => ({ ...prev, isJoining: false }));
    }
  };

  const handleUnjoinEvent = async () => {
    try {
      setState((prev) => ({ ...prev, isJoining: true }));
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

      toast.success("Successfully left the event!");
      router.refresh();
    } catch (error) {
      toast.error("Failed to leave the event");
      console.error("Error leaving event:", error);
    } finally {
      setState((prev) => ({ ...prev, isJoining: false }));
    }
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: event.title,
        text: event.description,
        url: window.location.href,
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  return {
    state,
    handleDelete,
    handleJoinEvent,
    handleUnjoinEvent,
    handleShare,
  };
};
