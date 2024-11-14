import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface EventData {
  id?: string;
  title?: string;
  description?: string;
  date?: string;
  location?: string;
  image_url?: string;
  event?: {
    id?: string;
  };
}

interface UseEventFormProps {
  event?: EventData;
  formType: "Create" | "Edit";
  user: any;
  token: any;
  uploadedImageUrl: string;
}

export const useEventForm = ({
  event,
  formType,
  user,
  token,
  uploadedImageUrl,
}: UseEventFormProps) => {
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: event?.title || "",
    description: event?.description || "",
    date: event?.date || "",
    location: event?.location || "",
  });

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please log in to create events");
      router.push("/auth");
      return;
    }

    const { title, description, date, location } = formData;
    if (!title || !description || !date || !location) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);

    try {
      if (!token) {
        throw new Error("No authentication token found");
      }

      const eventData = {
        ...formData,
        image_url: uploadedImageUrl,
        creator_id: user.id,
      };

      const response = await fetch(
        `${BACKEND_URL}/events${formType === "Edit" ? `/${params.id}` : ""}`,
        {
          method: formType === "Create" ? "POST" : "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(eventData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save event");
      }

      toast.success(
        `Event ${formType === "Create" ? "created" : "updated"} successfully!`
      );
      queryClient.invalidateQueries({ queryKey: ["events"] });
      router.push("/events");
    } catch (error) {
      console.error("Event save error:", error);
      toast.error(`Failed to ${formType.toLowerCase()} event`);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    isLoading,
    handleInputChange,
    handleSubmit,
  };
};
