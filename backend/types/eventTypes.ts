export interface Event {
  id: number;
  title: string;
  date: string;
  description?: string;
}

export interface NewEvent extends Omit<Event, "id"> {}
