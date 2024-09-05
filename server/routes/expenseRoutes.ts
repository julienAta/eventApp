import { Router } from "express";
import {
  getAllExpenses,
  getExpensesByEvent,
  createExpense,
  updateExpenseById,
  deleteExpenseById,
} from "../controllers/expenseController.js";

const router = Router();

router.get("/", getAllExpenses);
router.get("/event/:eventId", getExpensesByEvent);
router.post("/", createExpense);
router.put("/:id", updateExpenseById);
router.delete("/:id", deleteExpenseById);

export default router;
