import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

export function EventList({ events }: { events: any[] }) {
  console.log(events, "eventsss");

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Upcoming Events</h1>
      {events.length < 1 ? (
        <p className="text-gray-600">There are no upcoming events.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event, index) => (
            <Link href={`/events/${event.id}`} key={index} passHref>
              <Card className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-2">{event.title}</h2>
                  <p className="text-gray-600 mb-4">{event.description}</p>
                  <div className="flex items-center justify-between">
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
    </div>
  );
}
