"use client";
import { FC, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
interface EventFormProps {
  event?: {
    id?: string;
    title?: string;
    description?: string;
    date?: string;
    location?: string;
  };
  formType: "Create" | "Edit";
}

const EventForm: FC<EventFormProps> = ({ event, formType }) => {
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [title, setTitle] = useState(event?.title || "");
  const [description, setDescription] = useState(event?.description || "");
  const [date, setDate] = useState(event?.date || "");
  const [location, setLocation] = useState(event?.location || "");
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const eventData = { title, description, date, location };

    try {
      let response;
      if (formType === "Create") {
        response = await fetch(`${BACKEND_URL}/events`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(eventData),
        });
      } else {
        response = await fetch(`${BACKEND_URL}/events/${params.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(eventData),
        });
      }

      if (response.ok) {
        toast(
          `Event ${formType === "Create" ? "created" : "updated"} successfully!`
        );

        if (formType === "Create") {
          queryClient.invalidateQueries({
            queryKey: ["events"],
          });
          router.push("/events");
        }
      } else {
        throw new Error("Something went wrong");
      }
    } catch (error) {
      toast(
        `Failed to ${
          formType === "Create" ? "create" : "update"
        } event: ${error}`
      );
    }
  };

  return (
    <div className="container mx-auto max-w-2xl py-8">
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>{formType} Event</CardTitle>
            <CardDescription>
              {formType === "Create"
                ? "Fill out the details below to create a new event."
                : "Update the details below to edit the event."}
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
                value={title}
                onChange={(e) => setTitle(e.target.value)}
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
                value={description}
                onChange={(e) => setDescription(e.target.value)}
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
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
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
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button className="bg-primary hover:bg-primary/80" type="submit">
              {formType} Event
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};

export default EventForm;
