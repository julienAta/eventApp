import { z } from "zod";

export const ExpenseSchema = z.object({
  id: z.number(),
  event_id: z.number(),
  description: z.string(),
  amount: z.number().positive(),
  date: z.string(),
  paid_by: z.string(),
});

export const NewExpenseSchema = ExpenseSchema.omit({ id: true });

export type Expense = z.infer<typeof ExpenseSchema>;
export type NewExpense = z.infer<typeof NewExpenseSchema>;
