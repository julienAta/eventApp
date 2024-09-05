import { Request, Response } from "express";
import {
  getEvents,
  addEvent,
  updateEvent,
  deleteEvent,
} from "../models/eventModel.js";
import { EventSchema, NewEventSchema } from "../schemas/eventSchema.js";
import { logger } from "../utils/logger";

export const getAllEvents = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const events = await getEvents();
    logger.info("All events fetched successfully");
    res
      .status(200)
      .json({ message: "Events fetched successfully", events: events });
  } catch (error) {
    logger.error("Error occurred while fetching all events", { error });
    res.status(500).json({ message: "An unexpected error occurred" });
  }
};

export const getEventById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const events = await getEvents();
    const eventID = parseInt(req.params.id, 10);
    const event = events.find((e) => e.id === eventID);

    if (event) {
      const validatedEvent = EventSchema.parse(event);
      logger.info("Event fetched successfully", { eventId: eventID });
      res.json({
        message: "Event fetched successfully",
        event: validatedEvent,
      });
    } else {
      logger.warn("Event not found", { eventId: eventID });
      res.status(404).json({ message: "Event not found" });
    }
  } catch (error) {
    logger.error("Error occurred while fetching event by ID", {
      error,
      eventId: req.params.id,
    });
    res.status(500).json({ message: "An unexpected error occurred" });
  }
};

export const createEvent = async (
  req: Request,
  res: Response
): Promise<void> => {
  logger.info("Attempting to create a new event");

  try {
    logger.debug("Received create event request", {
      headers: req.headers,
      body: req.body,
    });

    const validatedData = NewEventSchema.parse(req.body);
    logger.info("Event data validated successfully");

    const createdEvent = await addEvent(validatedData);
    logger.info("Event added to database successfully", {
      eventId: createdEvent.id,
    });

    const validatedEvent = EventSchema.parse(createdEvent);
    logger.info("Created event data validated successfully");

    res.status(201).json({
      message: "Event created successfully",
      event: validatedEvent,
    });
    logger.info("Create event response sent successfully");
  } catch (error: any) {
    logger.error("Error occurred while creating event", { error });

    if (error.name === "ZodError") {
      const validationErrors = error.errors.map((e: any) => ({
        field: e.path.join("."),
        message: e.message,
      }));
      logger.warn("Validation failed for event creation", { validationErrors });
      res.status(400).json({
        message: "Invalid event data",
        errors: validationErrors,
      });
    } else if (error.code === "23505") {
      logger.warn("Attempted to create duplicate event", {
        error: error.detail,
      });
      res.status(409).json({
        message: "An event with this title already exists",
        error: error.detail,
      });
    } else {
      logger.error("Unexpected error during event creation", { error });
      res.status(500).json({
        message: "An unexpected error occurred while creating the event",
        error:
          process.env.NODE_ENV === "production"
            ? "Internal server error"
            : error.message,
      });
    }
  }
};
export const updateEventById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const updatedEvent = NewEventSchema.partial().parse(req.body);
    const data = await updateEvent(id, updatedEvent);
    if (data) {
      const validatedData = EventSchema.parse(data);
      logger.info("Event updated successfully", { eventId: id });
      res.status(200).json({ message: "Event updated", event: validatedData });
    } else {
      logger.warn("Event not found for update", { eventId: id });
      res.status(404).json({ message: "Event not found" });
    }
  } catch (error) {
    if (error instanceof Error) {
      logger.warn("Invalid request body for event update", {
        error: error.message,
        eventId: req.params.id,
      });
      res
        .status(400)
        .json({ message: "Invalid request body", error: error.message });
    } else {
      logger.error("Unexpected error occurred during event update", {
        error,
        eventId: req.params.id,
      });
      res.status(500).json({ message: "An unexpected error occurred" });
    }
  }
};

export const deleteEventById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    await deleteEvent(id);
    logger.info("Event deleted successfully", { eventId: id });
    res.status(204).json({ message: "Event deleted successfully" });
  } catch (error) {
    logger.error("Error occurred while deleting event", {
      error,
      eventId: req.params.id,
    });
    res.status(500).json({ message: "An unexpected error occurred" });
  }
};
