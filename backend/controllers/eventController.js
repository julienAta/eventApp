import { events } from "../models/index.js";

export const getAllEvents = (req, res) => {
  res.json(events);
};

export const getEventById = (req, res) => {
  const event = events.find((e) => e.id === req.params.id);
  if (event) {
    res.json(event);
  } else {
    res.status(404).send("Event not found");
  }
};

export const createEvent = (req, res) => {
  const newEvent = { id: Date.now().toString(), ...req.body };
  events.push(newEvent);
  res.status(201).json(newEvent);
};

export const updateEvent = (req, res) => {
  const index = events.findIndex((e) => e.id === req.params.id);
  if (index !== -1) {
    events[index] = { ...events[index], ...req.body };
    res.json(events[index]);
  } else {
    res.status(404).send("Event not found");
  }
};

export const deleteEvent = (req, res) => {
  events = events.filter((e) => e.id !== req.params.id);
  res.status(204).send();
};
