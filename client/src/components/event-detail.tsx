"use client";
import { Button } from "@/components/ui/button";
import { CalendarIcon, LocateIcon } from "lucide-react";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export function EventDetail({ event }: { event: any }) {
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const router = useRouter();
  const queryClient = useQueryClient();
  console.log(event, "event");

  const handleDelete = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/events/${event.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete the event.");
      }

      queryClient.invalidateQueries({
        queryKey: ["events"],
      });
      toast("Event deleted successfully");
      router.push("/events");
    } catch (error) {
      toast("Failed to delete the event.");
      console.error("Error deleting event:", error);
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
                {event.date}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <LocateIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              <span className="text-gray-600 dark:text-gray-400">
                {event.location}
              </span>
            </div>
          </div>
          <Link href={`/events/${event.id}/edit`}>
            <Button className="w-full sm:w-auto">Update Details</Button>
          </Link>
          <Button
            onClick={() => handleDelete()}
            className="w-full sm:w-auto ml-5 mt-5"
          >
            Delete
          </Button>
        </div>
        <div>
          <img
            alt="Event Image"
            className="rounded-lg object-cover w-full h-full"
            height="400"
            src={event.image_url || "/placeholder.svg"}
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
