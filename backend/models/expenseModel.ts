import { Expense, NewExpense } from "../schemas/expenseSchema";

let expenses: Expense[] = [];

export const getExpenses = async (): Promise<Expense[]> => {
  return expenses;
};

export const getExpensesByEventId = async (
  eventId: number
): Promise<Expense[]> => {
  return expenses.filter((expense) => expense.eventId === eventId);
};

export const addExpense = async (newExpense: NewExpense): Promise<Expense> => {
  const expense: Expense = {
    id: expenses.length + 1,
    ...newExpense,
  };
  expenses.push(expense);
  return expense;
};

export const updateExpense = async (
  id: string,
  updatedExpense: Partial<NewExpense>
): Promise<Expense | null> => {
  const index = expenses.findIndex((e) => e.id === parseInt(id, 10));
  if (index !== -1) {
    expenses[index] = { ...expenses[index], ...updatedExpense };
    return expenses[index];
  }
  return null;
};

export const deleteExpense = async (id: string): Promise<void> => {
  expenses = expenses.filter((e) => e.id !== parseInt(id, 10));
};
