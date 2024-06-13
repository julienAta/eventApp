import { Button } from "@/components/ui/button";
import { CalendarIcon, LocateIcon } from "lucide-react";
import { Card } from "../ui/card";
import Link from "next/link";

export function EventDetail({ event }: { event: any }) {
  return (
    <Card className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 mt-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mb-4">
            {event.title}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            {event.description}
          </p>
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
            <Button className="w-full sm:w-auto">Update Event Details</Button>
          </Link>
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
