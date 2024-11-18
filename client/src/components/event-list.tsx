"use client";
import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Calendar, MapPin, Users, Search, Filter } from "lucide-react";
import { fetchEvents } from "@/actions/events";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Type Definitions
type ViewMode = "grid" | "table";
type SortOrder = "asc" | "desc";

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  capacity: number;
  category: string;
  createdAt: string;
  updatedAt: string;
  organizerId: string;
}

interface EventListProps {
  events: Event[];
}

interface FilterState {
  search: string;
  categories: string[];
  sortOrder: SortOrder;
}

export function EventList({ events: initialEvents }: EventListProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    categories: [],
    sortOrder: "asc",
  });

  const { data: events } = useQuery<Event[], Error>({
    queryFn: () => fetchEvents(),
    queryKey: ["events"],
    initialData: initialEvents,
    staleTime: 0,
  });

  const categories: string[] = Array.from(
    new Set(events.map((event) => event.category))
  );

  const filteredEvents: Event[] = events
    .filter((event) => {
      const matchesSearch = event.title
        .toLowerCase()
        .includes(filters.search.toLowerCase());
      const matchesCategory =
        filters.categories.length === 0 ||
        filters.categories.includes(event.category);
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return filters.sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

  const updateSearch = (search: string) => {
    setFilters((prev) => ({ ...prev, search }));
  };

  const updateCategories = (category: string, checked: boolean) => {
    setFilters((prev) => ({
      ...prev,
      categories: checked
        ? [...prev.categories, category]
        : prev.categories.filter((c) => c !== category),
    }));
  };

  const updateSortOrder = (sortOrder: SortOrder) => {
    setFilters((prev) => ({ ...prev, sortOrder }));
  };

  const EventGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredEvents.map((event) => (
        <Link href={`/events/${event.id}`} key={event.id} passHref>
          <Card className="group h-full hover:shadow-lg transition-all duration-300 border border-border/50">
            <CardContent className="p-6 flex flex-col h-full">
              <div className="flex items-start justify-between mb-4">
                {/* <div className="bg-primary/10 text-primary rounded-lg px-3 py-1 text-sm">
                  {event.category}
                </div> */}
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span className="text-sm">{event.capacity}</span>
                </div>
              </div>

              <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                {event.title}
              </h2>
              <p className="text-muted-foreground text-sm mb-4 line-clamp-2 flex-grow">
                {event.description}
              </p>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">
                    {new Date(event.date).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm truncate">{event.location}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );

  const EventTableView = () => (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Event</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Location</TableHead>
            <TableHead className="text-right">Capacity</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredEvents.map((event) => (
            <TableRow key={event.id}>
              <TableCell>
                <Link
                  href={`/events/${event.id}`}
                  className="font-medium hover:text-primary transition-colors"
                >
                  {event.title}
                </Link>
                <p className="text-sm text-muted-foreground line-clamp-1">
                  {event.description}
                </p>
              </TableCell>
              <TableCell>
                <span className="bg-primary/10 text-primary rounded-lg px-2 py-1 text-sm">
                  {event.category}
                </span>
              </TableCell>
              <TableCell>{new Date(event.date).toLocaleDateString()}</TableCell>
              <TableCell>{event.location}</TableCell>
              <TableCell className="text-right">{event.capacity}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search events..."
              value={filters.search}
              onChange={(e) => updateSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          {/* <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex gap-2">
                <Filter className="h-4 w-4" />
                Categories
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {categories.map((category) => (
                <DropdownMenuCheckboxItem
                  key={category}
                  checked={filters.categories.includes(category)}
                  onCheckedChange={(checked) => {
                    updateCategories(category, checked);
                  }}
                >
                  {category}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu> */}
        </div>
        <div className="flex gap-4">
          <Select
            value={filters.sortOrder}
            onValueChange={(value: SortOrder) => updateSortOrder(value)}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Sort by date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">Oldest first</SelectItem>
              <SelectItem value="desc">Newest first</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex rounded-lg border border-border">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="sm"
              className="rounded-r-none"
              onClick={() => setViewMode("grid")}
            >
              Grid
            </Button>
            <Button
              variant={viewMode === "table" ? "secondary" : "ghost"}
              size="sm"
              className="rounded-l-none"
              onClick={() => setViewMode("table")}
            >
              Table
            </Button>
          </div>
        </div>
      </div>

      {filteredEvents.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No events found matching your criteria.
          </p>
        </div>
      ) : viewMode === "grid" ? (
        <EventGridView />
      ) : (
        <EventTableView />
      )}
    </div>
  );
}
