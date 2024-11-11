export interface Event {
  id: number;
  title: string;
  date: string;
  description?: string;
  creator_id: string;
}

export interface NewEvent extends Omit<Event, "id"> {}
