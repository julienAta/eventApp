export type Event = {
  id: number;
  name: string;
  date: Date;
  location: string;
  description: string | null;
  title: string; // This is causing the issue
  expenses: number[];
};

export type NewEvent = Omit<Event, "id" | "expenses">;
