import request from "supertest";
import express from "express";
import expenseRoutes from "../../routes/expenseRoutes";
import * as expenseModel from "../../models/expenseModel";

const app = express();
app.use(express.json());
app.use("/expenses", expenseRoutes);

// Mock the expenseModel
jest.mock("../../models/expenseModel");

describe("Expense Integration Tests", () => {
  test("GET /expenses returns all expenses", async () => {
    const mockExpenses = [
      {
        id: 1,
        event_id: 1,
        description: "Test Expense",
        amount: 100,
        date: "2023-04-01",
        paid_by: "John",
      },
    ];
    (expenseModel.getExpenses as jest.Mock).mockResolvedValue(mockExpenses);

    const response = await request(app).get("/expenses");
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockExpenses);
  });

  test("POST /expenses creates a new expense", async () => {
    const newExpense = {
      event_id: 1,
      description: "New Expense",
      amount: 50,
      date: "2023-04-02",
      paid_by: "Jane",
    };
    const createdExpense = { id: 2, ...newExpense };
    (expenseModel.addExpense as jest.Mock).mockResolvedValue(createdExpense);

    const response = await request(app)
      .post("/expenses")
      .send(newExpense)
      .set("Accept", "application/json");

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      message: "Expense created successfully",
      expense: createdExpense,
    });
  });

  test("GET /expenses/event/:eventId returns expenses for a specific event", async () => {
    const eventId = 1;
    const mockExpenses = [
      {
        id: 1,
        event_id: eventId,
        description: "Event Expense",
        amount: 150,
        date: "2023-04-03",
        paid_by: "Alice",
      },
    ];
    (expenseModel.getExpensesByEventId as jest.Mock).mockResolvedValue(
      mockExpenses
    );

    const response = await request(app).get(`/expenses/event/${eventId}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockExpenses);
  });

  test("PUT /expenses/:id updates an existing expense", async () => {
    const expenseId = "1";
    const updatedExpense = {
      description: "Updated Expense",
      amount: 75,
    };
    const fullUpdatedExpense = {
      id: 1,
      event_id: 1,
      description: "Updated Expense",
      amount: 75,
      date: "2023-04-01",
      paid_by: "John",
    };
    (expenseModel.updateExpense as jest.Mock).mockResolvedValue(
      fullUpdatedExpense
    );

    const response = await request(app)
      .put(`/expenses/${expenseId}`)
      .send(updatedExpense)
      .set("Accept", "application/json");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "Expense updated",
      expense: fullUpdatedExpense,
    });
  });
});
