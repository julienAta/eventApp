import { Request, Response } from "express";
import {
  getEvents,
  addEvent,
  updateEvent,
  deleteEvent,
} from "../models/eventModel";
import { Event, NewEvent } from "../types/eventTypes";

export const getAllEvents = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const events: Event[] = await getEvents();
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
    const events: Event[] = await getEvents();
    const eventID = parseInt(req.params.id, 10);
    const event = events.find((e) => e.id === eventID);
    if (event) {
      res.json(event);
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
    const newEvent: NewEvent = { ...req.body };
    const data = await addEvent(newEvent);
    res.status(201).json(data);
  } catch (error) {
    res.status(500).send((error as Error).message);
  }
};

export const updateEventById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const updatedEvent: Partial<Event> = req.body;
    const data = await updateEvent(id, updatedEvent);
    if (data) {
      res.status(200).json({ message: "Event updated", event: data });
    } else {
      res.status(404).json({ message: "Event not found" });
    }
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
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
