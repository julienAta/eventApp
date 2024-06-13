import { getEvents } from "../models/eventModel.js";

export const getAllEvents = async (req, res) => {
  const events = await getEvents();
  res.status(200).json(events);
};

export const getEventById = async (req, res) => {
  const events = await getEvents();
  const eventID = parseInt(req.params.id, 10);
  const event = events.find((e) => e.id === eventID);
  if (event) {
    res.json(event);
  } else {
    res.status(404).send("Event not found");
  }
};

export const createEvent = (req, res) => {
  const events = getEvents();
  const newEvent = { id: Date.now().toString(), ...req.body };
  console.log("newEvent", newEvent);
  events.push(newEvent);
  res.status(201).json(newEvent);
};

export const updateEventById = (req, res) => {
  const { id } = req.params;
  const updatedEvent = req.body;
  const index = events.findIndex((event) => event.id === id);
  if (index !== -1) {
    events[index] = { ...events[index], ...updatedEvent };
    res.json(events[index]);
  } else {
    res.status(404).send("Event not found");
  }
};

export const deleteEventById = (req, res) => {
  const events = getEvents();
  const { id } = req.params;
  events = events.filter((event) => event.id !== id);
  res.status(204).send();
};
