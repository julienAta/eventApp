// hooks/useEventImage.ts
import { useState, useRef } from "react";
import { toast } from "sonner";

interface UseEventImageProps {
  initialImageUrl?: string;
  eventId?: string;
}

export const useEventImage = ({
  initialImageUrl,
  eventId,
}: UseEventImageProps) => {
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState(initialImageUrl || "");
  const [uploadedImageUrl, setUploadedImageUrl] = useState(
    initialImageUrl || ""
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleImageUpload = async () => {
    if (!image) {
      toast.error("Please select an image first");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", image);
      if (eventId) {
        formData.append("eventId", eventId);
      }

      const response = await fetch(`${BACKEND_URL}/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await response.json();
      setUploadedImageUrl(data.url);
      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image");
    }
  };

  const openFileInput = () => {
    fileInputRef.current?.click();
  };

  return {
    image,
    previewUrl,
    uploadedImageUrl,
    fileInputRef,
    handleImageChange,
    handleImageUpload,
    openFileInput,
  };
};
