import { Request, Response } from "express";
import {
  getExpenses,
  getExpensesByEventId,
  addExpense,
  updateExpense,
  deleteExpense,
} from "../models/expenseModel.js";
import { ExpenseSchema, NewExpenseSchema } from "../schemas/expenseSchema.js";
import { logger } from "../app.js"; // Import the logger

export const getAllExpenses = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const expenses = await getExpenses();
    logger.info("Retrieved all expenses successfully");
    res.status(200).json(expenses);
  } catch (error) {
    logger.error("Error occurred while fetching all expenses", { error });
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
    logger.info("Retrieved expenses by event ID", { eventId });
    res.status(200).json(expenses);
  } catch (error) {
    logger.error("Error occurred while fetching expenses by event ID", {
      error,
      eventId: req.params.eventId,
    });
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
    logger.info("Expense created successfully", {
      expenseId: validatedData.id,
    });
    res.status(201).json({
      message: "Expense created successfully",
      expense: validatedData,
    });
  } catch (error) {
    if (error instanceof Error) {
      logger.warn("Invalid request body for expense creation", {
        error: error.message,
      });
      res
        .status(400)
        .json({ message: "Invalid request body", error: error.message });
    } else {
      logger.error("Unexpected error occurred during expense creation", {
        error,
      });
      res.status(500).json({ message: "An unexpected error occurred" });
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
      logger.info("Expense updated successfully", { expenseId: id });
      res
        .status(200)
        .json({ message: "Expense updated", expense: validatedData });
    } else {
      logger.warn("Expense not found for update", { expenseId: id });
      res.status(404).json({ message: "Expense not found" });
    }
  } catch (error) {
    if (error instanceof Error) {
      logger.warn("Invalid request body for expense update", {
        error: error.message,
        expenseId: req.params.id,
      });
      res
        .status(400)
        .json({ message: "Invalid request body", error: error.message });
    } else {
      logger.error("Unexpected error occurred during expense update", {
        error,
        expenseId: req.params.id,
      });
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
    logger.info("Expense deleted successfully", { expenseId: id });
    res.status(204).json({ message: "Expense deleted successfully" });
  } catch (error) {
    logger.error("Error occurred while deleting expense", {
      error,
      expenseId: req.params.id,
    });
    res.status(500).json({ message: "An unexpected error occurred" });
  }
};
