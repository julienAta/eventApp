"use client";
import { FC, useState, useRef, useEffect } from "react";
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
import { set } from "zod";

interface EventFormProps {
  event?: {
    id?: string;
    title?: string;
    description?: string;
    date?: string;
    location?: string;
    image_url?: string;
    event?: {
      id?: string;
    };
  };
  formType: "Create" | "Edit";
}

const EventForm: FC<EventFormProps> = ({ event, formType }) => {
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [user, setUser] = useState<any>(null);
  const [title, setTitle] = useState(event?.title || "");
  const [description, setDescription] = useState(event?.description || "");
  const [date, setDate] = useState(event?.date || "");
  const [location, setLocation] = useState(event?.location || "");
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState(event?.image_url || "");
  const [uploadedImageUrl, setUploadedImageUrl] = useState(
    event?.image_url || ""
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };
  const handleImageUpload = async () => {
    if (!image) {
      toast("Please select an image first");
      return;
    }

    const formData = new FormData();
    formData.append("file", image);

    // If we're editing an existing event, use its ID
    // If it's a new event, we'll need to create the event first before uploading the image
    if (event?.event?.id) {
      formData.append("eventId", event.event.id);
    }

    console.log("Uploading image:", {
      fileName: image.name,
      fileSize: image.size,
      fileType: image.type,
      eventId: event?.event?.id || "New Event",
    });

    try {
      const response = await fetch(`${BACKEND_URL}/upload`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Upload successful:", data);
        setUploadedImageUrl(data.url);
        toast("Image uploaded successfully!");
        if (event?.id) {
          console.log("Existing event updated:", event.id);
        } else {
          console.log("Image uploaded for new event, URL:", data.url);
          // Store this URL to use when creating the new event
        }
      } else {
        const errorData = await response.json();
        console.error("Upload failed:", errorData);
        throw new Error(errorData.details || "Failed to upload image");
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      toast(`Failed to upload image: ${error.message}`);
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const eventData = {
      title,
      description,
      date,
      location,
      image_url: uploadedImageUrl,
      creator_id: user.id,
    };

    try {
      let response;
      if (formType === "Create") {
        response = await fetch(`${BACKEND_URL}/events`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(eventData), // Sending a single object
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
        queryClient.invalidateQueries({
          queryKey: ["events"],
        });
        router.push("/events");
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

  useEffect(() => {
    async function fetchUser() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          return;
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/me`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const userData = await response.json();
        console.log("User data:", userData);

        setUser(userData);
      } catch (error) {
        console.error("Error fetching user events:", error);
      }
    }

    fetchUser();
  }, []);

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

            <div>
              <Label className="mb-2" htmlFor="image">
                Event Image
              </Label>
              <Input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleImageChange}
                ref={fileInputRef}
                className="hidden"
              />
              <div className="flex items-center space-x-4">
                <Button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Choose Image
                </Button>
                <Button
                  type="button"
                  onClick={handleImageUpload}
                  disabled={!image}
                >
                  Upload Image
                </Button>
                {previewUrl && (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-20 h-20 object-cover rounded"
                  />
                )}
              </div>
              {uploadedImageUrl && (
                <p className="mt-2 text-sm text-green-600">
                  Image uploaded successfully!
                </p>
              )}
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
