import { Request, Response } from "express";
import {
  getExpenses,
  getExpensesByEventId,
  addExpense,
  updateExpense,
  deleteExpense,
} from "../models/expenseModel";
import { ExpenseSchema, NewExpenseSchema } from "../schemas/expenseSchema";

export const getAllExpenses = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const expenses = await getExpenses();
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).send((error as Error).message);
  }
};

export const getExpensesByEvent = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const eventId = parseInt(req.params.eventId, 10);
    const expenses = await getExpensesByEventId(eventId);
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).send((error as Error).message);
  }
};

export const createExpense = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const newExpense = NewExpenseSchema.parse(req.body);
    const data = await addExpense(newExpense);
    const validatedData = ExpenseSchema.parse(data);
    res.status(201).json(validatedData);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).send("An unexpected error occurred");
    }
  }
};

export const updateExpenseById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const updatedExpense = NewExpenseSchema.partial().parse(req.body);
    const data = await updateExpense(id, updatedExpense);
    if (data) {
      const validatedData = ExpenseSchema.parse(data);
      res
        .status(200)
        .json({ message: "Expense updated", expense: validatedData });
    } else {
      res.status(404).json({ message: "Expense not found" });
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ message: "An unexpected error occurred" });
    }
  }
};

export const deleteExpenseById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    await deleteExpense(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).send((error as Error).message);
  }
};
