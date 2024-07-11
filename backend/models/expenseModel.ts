import { createClient } from "@supabase/supabase-js";
import { Expense, NewExpense } from "../schemas/expenseSchema";

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL as string;
const supabaseKey = process.env.SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseKey);

export const getExpenses = async (): Promise<Expense[]> => {
  const { data, error } = await supabase.from("expenses").select("*");

  if (error) throw error;
  return data as Expense[];
};

export const getExpensesByEventId = async (
  eventId: number
): Promise<Expense[]> => {
  const { data, error } = await supabase
    .from("expenses")
    .select("*")
    .eq("event_id", eventId);

  if (error) throw error;
  return data as Expense[];
};

export const addExpense = async (newExpense: NewExpense): Promise<Expense> => {
  const { data, error } = await supabase
    .from("expenses")
    .insert(newExpense)
    .single();

  if (error) throw error;
  return data as Expense;
};

export const updateExpense = async (
  id: string,
  updatedExpense: Partial<NewExpense>
): Promise<Expense | null> => {
  const { data, error } = await supabase
    .from("expenses")
    .update(updatedExpense)
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as Expense;
};

export const deleteExpense = async (id: string): Promise<void> => {
  const { error } = await supabase.from("expenses").delete().eq("id", id);

  if (error) throw error;
};
