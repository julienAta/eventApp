import { Event } from "@/types/event";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  PieChart,
  User2 as UserGroupIcon,
  CalendarDaysIcon,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { Spinner } from "@/components/spinner";
import Link from "next/link";
interface DashboardStats {
  totalEvents: number;
  upcomingEvents: number;
  totalParticipants: number;
  averageParticipants: number;
}

export default function Dashboard({
  events,
  user,
}: {
  events: Event[];
  user: any;
}) {
  const filteredEvents = events.filter((event) => event.creator_id === user.id);

  const stats: DashboardStats = filteredEvents.reduce(
    (acc, event) => {
      const now = new Date();
      const eventDate = new Date(event.date);
      const participantsCount = event.users?.length || 0;

      return {
        totalEvents: acc.totalEvents + 1,
        upcomingEvents:
          eventDate > now ? acc.upcomingEvents + 1 : acc.upcomingEvents,
        totalParticipants: acc.totalParticipants + participantsCount,
        averageParticipants: Math.round(
          (acc.totalParticipants + participantsCount) / (acc.totalEvents + 1)
        ),
      };
    },
    {
      totalEvents: 0,
      upcomingEvents: 0,
      totalParticipants: 0,
      averageParticipants: 0,
    }
  );

  if (!filteredEvents.length) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold">No events found</p>
          <p className="text-sm text-muted-foreground">
            Create your first event to get started
          </p>
          <Link href="/events/create" className="mt-4 inline-block">
            <button className="rounded bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90">
              Create Event
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Event Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEvents}</div>
            <p className="text-xs text-muted-foreground">Events created</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Upcoming Events
            </CardTitle>
            <CalendarDaysIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcomingEvents}</div>
            <p className="text-xs text-muted-foreground">Events to come</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Participants
            </CardTitle>
            <UserGroupIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalParticipants}</div>
            <p className="text-xs text-muted-foreground">
              People joined your events
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Average Participants
            </CardTitle>
            <UserGroupIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.averageParticipants}
            </div>
            <p className="text-xs text-muted-foreground">Per event</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="upcoming" className="space-y-4">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
          <TabsTrigger value="past">Past Events</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {filteredEvents
            .filter((event) => new Date(event.date) > new Date())
            .map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
        </TabsContent>

        <TabsContent value="past" className="space-y-4">
          {filteredEvents
            .filter((event) => new Date(event.date) <= new Date())
            .map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function EventCard({ event }: { event: Event }) {
  const participantsCount = event.users?.length || 0;
  const eventDate = new Date(event.date);
  const isPast = eventDate <= new Date();

  return (
    <Link href={`/events/${event.id}`}>
      <Card className="hover:bg-accent/50 transition-colors">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">{event.title}</h3>
              <p className="text-sm text-muted-foreground">
                {eventDate.toLocaleDateString()}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {participantsCount} participant
                {participantsCount !== 1 ? "s" : ""}
              </p>
            </div>
            <div
              className={`flex items-center ${
                isPast ? "text-red-500" : "text-green-500"
              }`}
            >
              {isPast ? <ArrowDownRight /> : <ArrowUpRight />}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
