"use client";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { fetchEvents } from "@/actions/events";
import { useQuery } from "@tanstack/react-query";

export function EventList({ events }: { events: any[] }) {
  const { data } = useQuery({
    queryFn: () => fetchEvents(),
    queryKey: ["events"],
    initialData: events,
    staleTime: 0,
  });

  return (
    <>
      {data.length < 1 ? (
        <p className="text-gray-600">There are no upcoming events.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((event, index) => (
            <Link href={`/events/${event.id}`} key={index} passHref>
              <Card className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
                <CardContent className="p-6 flex flex-col flex-grow">
                  <h2 className="text-xl font-bold mb-2">{event.title}</h2>
                  <p className="text-gray-600 mb-4 flex-grow">
                    {event.description}
                  </p>
                  <div className="flex items-center justify-between mt-auto">
                    <div>
                      <p className="text-sm font-semibold mb-1">Date</p>
                      <p className="text-gray-600">{event.date}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold mb-1">Location</p>
                      <p className="text-gray-600">{event.location}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
