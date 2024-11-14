import { Event } from "@/types/event";

interface User {
  id: string;
  name: string;
  avatar_url?: string;
}

export const useEventHelpers = (event: Event, currentUser: User) => {
  const isParticipant = event.users?.includes(currentUser.id) || false;
  const participantsCount = event.users?.length || 0;
  const isCreator = event.creator_id === currentUser.id;
  const hasSpaceLeft = true;
  const eventDate = new Date(event.date);
  const isUpcoming = eventDate > new Date();

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(date);
  };

  return {
    isParticipant,
    participantsCount,
    isCreator,
    hasSpaceLeft,
    eventDate,
    isUpcoming,
    formatDate,
  };
};
