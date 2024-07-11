import { z } from "zod";

export const ExpenseSchema = z.object({
  id: z.number(),
  eventId: z.number(),
  description: z.string().min(1),
  amount: z.number().positive(),
  date: z.string(),
  paidBy: z.string(),
});

export const NewExpenseSchema = ExpenseSchema.omit({ id: true });

export type Expense = z.infer<typeof ExpenseSchema>;
export type NewExpense = z.infer<typeof NewExpenseSchema>;
