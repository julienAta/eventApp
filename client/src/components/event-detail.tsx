"use client";

import { Button } from "@/components/ui/button";
import {
  CalendarIcon,
  MapPinIcon,
  UserPlus,
  UserMinus,
  Share2,
  PencilIcon,
  TrashIcon,
} from "lucide-react";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import { Event } from "@/types/event";
import { useEventManagement } from "@/hooks/use-event-management";
import { useEventHelpers } from "@/hooks/use-event-helper";
interface User {
  id: string;
  name: string;
  avatar_url?: string;
}

interface EventDetailProps {
  event: Event;
  currentUser: User;
}

export function EventDetail({ event, currentUser }: EventDetailProps) {
  const {
    state: { isDeleting, isJoining },
    handleDelete,
    handleJoinEvent,
    handleUnjoinEvent,
    handleShare,
  } = useEventManagement(event, currentUser);

  const {
    isParticipant,
    participantsCount,
    isCreator,
    hasSpaceLeft,
    eventDate,
    isUpcoming,
    formatDate,
  } = useEventHelpers(event, currentUser);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative bg-muted">
        <div className="absolute inset-0 bg-gradient-to-t from-background to-background/60" />
        <div className="relative mx-auto px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="flex flex-col gap-4 max-w-4xl mx-auto text-center">
            <Badge
              variant={isUpcoming ? "default" : "secondary"}
              className="w-fit mx-auto"
            >
              {isUpcoming ? "Upcoming" : "Past Event"}
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              {event.title}
            </h1>
            <div className="flex items-center justify-center gap-6 text-muted-foreground">
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                <span>{formatDate(eventDate)}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPinIcon className="h-5 w-5" />
                <span>{event.location}</span>
              </div>
            </div>
            <div className="flex justify-center gap-4 mt-4">
              {!isCreator && (
                <Button
                  size="lg"
                  variant={isParticipant ? "outline" : "default"}
                  onClick={isParticipant ? handleUnjoinEvent : handleJoinEvent}
                  className="min-w-[140px]"
                >
                  {isJoining ? (
                    "Processing..."
                  ) : isParticipant ? (
                    <>
                      <UserMinus className="h-4 w-4 mr-2" />
                      Leave Event
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Join Event
                    </>
                  )}
                </Button>
              )}
              {isCreator && (
                <>
                  <Link href={`/events/${event.id}/edit`}>
                    <Button className="flex items-center gap-2">
                      <PencilIcon className="h-4 w-4" />
                      Edit Event
                    </Button>
                  </Link>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        className="flex items-center gap-2"
                      >
                        <TrashIcon className="h-4 w-4" />
                        Delete Event
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete the event and remove all participants.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDelete}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          {isDeleting ? "Deleting..." : "Delete Event"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </>
              )}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="lg" onClick={handleShare}>
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Share event</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <div className="prose dark:prose-invert">
                  <CardDescription className="text-base leading-relaxed">
                    {event.description}
                  </CardDescription>
                </div>

                {isCreator && (
                  <div className="mt-8 flex flex-wrap gap-4 pt-8 border-t">
                    <Link href={`/events/${event.id}/edit`}>
                      <Button className="flex items-center gap-2">
                        <PencilIcon className="h-4 w-4" />
                        Edit Event
                      </Button>
                    </Link>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          className="flex items-center gap-2"
                        >
                          <TrashIcon className="h-4 w-4" />
                          Delete Event
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete the event and remove all participants.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            {isDeleting ? "Deleting..." : "Delete Event"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <img
                  alt="Event cover"
                  src="/placeholder.svg"
                  className="w-full h-48 object-cover rounded-lg mb-6"
                />
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-4 border-b">
                    <span className="font-medium">Participants</span>
                    <span className="text-muted-foreground">
                      {participantsCount}
                    </span>
                  </div>
                  {hasSpaceLeft && (
                    <div className="flex items-center justify-between pb-4 border-b">
                      <span className="font-medium">Status</span>
                      <Badge variant="outline">Open</Badge>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
