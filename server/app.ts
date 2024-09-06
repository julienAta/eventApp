import express from "express";
import http from "http";
import dotenv from "dotenv";
import { initializeSocketIO } from "./socketHandlers/socketManager";
import { setupMiddleware } from "./middlewares/middleware.js";
import { logger } from "./utils/logger";
import router from "./routes/index.js";
import multer from "multer";
import { supabase } from "./supabase/supabaseClient";

dotenv.config();

const app = express();
const server = http.createServer(app);

initializeSocketIO(server);

setupMiddleware(app);

app.use("/api", router);

const port = process.env.PORT || 3000;
const upload = multer({ storage: multer.memoryStorage() });

router.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file) {
    logger.warn("Upload attempted without file");
    return res.status(400).send("No file uploaded.");
  }

  const file = req.file;
  const eventId = req.body.eventId;
  const fileName = `${Date.now()}_${file.originalname}`;

  logger.info(
    `Starting upload process for file: ${fileName}, eventId: ${eventId}`
  );

  try {
    // Upload file to Supabase Storage
    logger.info("Attempting to upload file to Supabase Storage");
    const { data, error } = await supabase.storage
      .from("event-images")
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) {
      logger.error("Supabase storage upload error:", {
        error: error.message,
        details: error,
      });
      throw error;
    }

    logger.info("File uploaded successfully, getting public URL");

    // Get public URL of the uploaded file
    const { data: publicUrlData } = supabase.storage
      .from("event-images")
      .getPublicUrl(fileName);

    const imageUrl = publicUrlData.publicUrl;
    logger.info(`Public URL obtained: ${imageUrl}`);

    // Update the events table with the new image URL
    if (eventId) {
      logger.info(`Updating events table for eventId: ${eventId}`);
      const { data: eventData, error: eventError } = await supabase
        .from("events")
        .update({ image_url: imageUrl })
        .eq("id", eventId)
        .select();

      if (eventError) {
        logger.error("Error updating event:", {
          error: eventError.message,
          details: eventError,
        });
        throw eventError;
      }

      logger.info("Event updated successfully");
      res.json({
        message: "File uploaded and event updated successfully",
        url: imageUrl,
        event: eventData[0],
      });
    } else {
      logger.info("No eventId provided, skipping event update");
      res.json({
        message: "File uploaded successfully",
        url: imageUrl,
      });
    }
  } catch (error: any) {
    logger.error("Error in upload process:", {
      error: error.message,
      stack: error.stack,
      requestBody: req.body,
      file: req.file
        ? {
            originalname: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size,
          }
        : "No file",
    });
    res
      .status(500)
      .json({ error: "Error in upload process", details: error.message });
  }
});

server.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});
