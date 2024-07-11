import { Request, Response } from "express";
import {
  getEvents,
  addEvent,
  updateEvent,
  deleteEvent,
} from "../models/eventModel";
import { EventSchema, NewEventSchema } from "../schemas/eventSchema";

export const getAllEvents = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const events = await getEvents();
    res.status(200).json(events);
  } catch (error) {
    res.status(500).send((error as Error).message);
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
      res.json(validatedEvent);
    } else {
      res.status(404).json({ error: "Event not found" });
    }
  } catch (error) {
    res.status(500).send((error as Error).message);
  }
};

export const createEvent = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const newEvent = NewEventSchema.parse(req.body);
    const data = await addEvent(newEvent);
    const validatedData = EventSchema.parse(data);
    res.status(201).json(validatedData);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).send("An unexpected error occurred");
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
      res.status(200).json({ message: "Event updated", event: validatedData });
    } else {
      res.status(404).json({ message: "Event not found" });
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
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
    res.status(204).send();
  } catch (error) {
    res.status(500).send((error as Error).message);
  }
};
