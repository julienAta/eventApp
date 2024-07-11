import { Expense, NewExpense } from "../schemas/expenseSchema";
import { supabase } from "../supabase/supabaseClient";

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
  console.log("Adding new expense:", newExpense);
  const { data, error } = await supabase
    .from("expenses")
    .insert({
      event_id: newExpense.event_id,
      description: newExpense.description,
      amount: newExpense.amount,
      date: newExpense.date,
      paid_by: newExpense.paid_by,
    })
    .select()
    .single();

  if (error) {
    console.error("Supabase error:", error);
    throw new Error(`Failed to add expense: ${error.message}`);
  }

  if (!data) {
    throw new Error("No data returned from Supabase");
  }

  console.log("Expense added successfully:", data);
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
    .select()
    .single();

  if (error) throw error;
  return data as Expense;
};

export const deleteExpense = async (id: string): Promise<void> => {
  const { error } = await supabase.from("expenses").delete().eq("id", id);

  if (error) throw error;
};
