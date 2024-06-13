export let events = [
  {
    id: "1",
    title: "Event 1",
    description: "Description for Event 1",
    date: "2023-06-01",
    location: "Location 1",
  },
  {
    id: "2",
    title: "Event 2",
    description: "Description for Event 2",
    date: "2023-06-15",
    location: "Location 2",
  },
];

export const addEvent = (event) => {
  events.push(event);
};

export const updateEvent = (id, updatedEvent) => {
  const index = events.findIndex((event) => event.id === id);
  if (index !== -1) {
    events[index] = { ...events[index], ...updatedEvent };
  }
};

export const deleteEvent = (id) => {
  events = events.filter((event) => event.id !== id);
};
