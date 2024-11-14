"use client";
import { FC } from "react";
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
import { useEventForm } from "@/hooks/use-event-form";
import { useEventImage } from "@/hooks/use-event-image";
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
  user: any;
  token: any;
}

const EventForm: FC<EventFormProps> = ({ event, formType, user, token }) => {
  const {
    image,
    previewUrl,
    uploadedImageUrl,
    fileInputRef,
    handleImageChange,
    handleImageUpload,
    openFileInput,
  } = useEventImage({
    initialImageUrl: event?.image_url,
    eventId: event?.event?.id,
  });

  const { formData, isLoading, handleInputChange, handleSubmit } = useEventForm(
    {
      event,
      formType,
      user,
      token,
      uploadedImageUrl,
    }
  );

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
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
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
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
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
                  value={formData.date}
                  onChange={(e) => handleInputChange("date", e.target.value)}
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
                  value={formData.location}
                  onChange={(e) =>
                    handleInputChange("location", e.target.value)
                  }
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
                <Button type="button" onClick={openFileInput}>
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
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-primary hover:bg-primary/80"
            >
              {isLoading ? "Saving..." : `${formType} Event`}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};

export default EventForm;
