import express from "express";
import { createClient } from "@supabase/supabase-js";
import multer from "multer";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

router.post("/events", upload.single("image"), async (req, res) => {
  try {
    const { title, description, date, location } = req.body;
    let image_url = null;

    if (req.file) {
      const file = req.file;
      const fileName = `${Date.now()}_${file.originalname}`;

      const { data, error } = await supabase.storage
        .from("event-images")
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
          upsert: false,
        });

      if (error) throw error;

      const { data: publicUrlData } = supabase.storage
        .from("event-images")
        .getPublicUrl(fileName);

      image_url = publicUrlData.publicUrl;
    }

    // Insert the event into the database, including the image_url
    const { data, error } = await supabase
      .from("events")
      .insert({ title, description, date, location, image_url })
      .select();

    if (error) throw error;

    res.status(201).json(data[0]);
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ error: "Failed to create event" });
  }
});

// Update the PUT route to handle image updates as well
router.put("/events/:id", upload.single("image"), async (req, res) => {
  // Similar logic to the POST route, but update the existing event
  // Don't forget to handle the case where no new image is uploaded
});

// ... (other event routes)

export default router;
