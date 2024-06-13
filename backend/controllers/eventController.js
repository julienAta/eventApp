import {
  getEvents,
  addEvent,
  updateEvent,
  deleteEvent,
} from "../models/eventModel.js";

export const getAllEvents = async (req, res) => {
  try {
    const events = await getEvents();
    res.status(200).json(events);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const getEventById = async (req, res) => {
  try {
    const events = await getEvents();
    const eventID = parseInt(req.params.id, 10);
    const event = events.find((e) => e.id === eventID);
    if (event) {
      res.json(event);
    } else {
      res.status(404).send("Event not found");
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const createEvent = async (req, res) => {
  try {
    const newEvent = { ...req.body };
    const data = await addEvent(newEvent);
    res.status(201).json(data);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const updateEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedEvent = req.body;
    const data = await updateEvent(id, updatedEvent);
    if (data) {
      res.status(200).json({ message: "Event updated", event: data });
    } else {
      res.status(404).json({ message: "Event not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteEventById = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteEvent(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).send(error.message);
  }
};
