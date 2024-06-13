import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export function EventForm() {
  return (
    <div className="container mx-auto max-w-2xl py-8">
      <Card>
        <CardHeader>
          <CardTitle>Create New Event</CardTitle>
          <CardDescription>
            Fill out the details below to create a new event.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="mb-2" htmlFor="title">
              Event Title
            </Label>
            <Input
              className="w-full"
              id="title"
              placeholder="Enter the event title"
            />
          </div>
          <div>
            <Label className="mb-2" htmlFor="description">
              Description
            </Label>
            <Textarea
              className="w-full"
              id="description"
              placeholder="Enter the event description"
              rows={3}
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label className="mb-2" htmlFor="date">
                Date
              </Label>
              <Input
                className="w-full"
                id="date"
                placeholder="Select the event date"
                type="date"
              />
            </div>
            <div>
              <Label className="mb-2" htmlFor="location">
                Location
              </Label>
              <Input
                className="w-full"
                id="location"
                placeholder="Enter the event location"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button className="bg-primary hover:bg-primary/80" type="submit">
            Create Event
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
