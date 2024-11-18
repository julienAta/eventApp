"use client";
import React, { useState, useEffect } from "react";
import { Plus, Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Card, CardTitle } from "./ui/card";
import { supabase } from "@/lib/supabase";

interface Expense {
  id: number;
  event_id: number;
  description: string;
  amount: number;
  date: string;
  paid_by: string;
}

interface ExpenseManagerProps {
  eventId: number;
  currentUser: { id: string; name: string };
}

export default function ExpenseManager({
  eventId,
  currentUser,
}: ExpenseManagerProps) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [newExpense, setNewExpense] = useState<Partial<Expense>>({
    event_id: eventId,
    paid_by: currentUser.id,
    date: new Date().toISOString().split("T")[0],
  });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  useEffect(() => {
    fetchExpenses();
  }, [eventId]);

  const fetchExpenses = async () => {
    const { data, error } = await supabase
      .from("expenses")
      .select(
        `
        *,
        users (
          name
        )
      `
      )
      .eq("event_id", eventId)
      .order("date", { ascending: false });

    if (error) {
      toast.error("Failed to fetch expenses");
      return;
    }

    if (data) {
      const formattedExpenses = data.map((expense: any) => ({
        ...expense,
      }));
      setExpenses(formattedExpenses);
    }
  };

  const handleAddExpense = async () => {
    const { error } = await supabase.from("expenses").insert({
      event_id: eventId,
      description: newExpense.description,
      amount: newExpense.amount,
      date: newExpense.date,
      paid_by: currentUser.id,
    });

    if (error) {
      toast.error("Failed to add expense");
      return;
    }

    fetchExpenses();
    setIsAddDialogOpen(false);
    setNewExpense({
      event_id: eventId,
      paid_by: currentUser.id,
      date: new Date().toISOString().split("T")[0],
    });
    toast.success("Expense added successfully");
  };

  const handleEditExpense = async () => {
    if (!editingExpense) return;

    const { error } = await supabase
      .from("expenses")
      .update({
        description: editingExpense.description,
        amount: editingExpense.amount,
        date: editingExpense.date,
      })
      .eq("id", editingExpense.id)
      .eq("paid_by", currentUser.id); // Ensure user can only edit their own expenses

    if (error) {
      toast.error("Failed to update expense");
      return;
    }

    fetchExpenses();
    setIsEditDialogOpen(false);
    setEditingExpense(null);
    toast.success("Expense updated successfully");
  };

  const handleDeleteExpense = async (id: number) => {
    const { error } = await supabase
      .from("expenses")
      .delete()
      .eq("id", id)
      .eq("paid_by", currentUser.id); // Ensure user can only delete their own expenses

    if (error) {
      toast.error("Failed to delete expense");
      return;
    }

    fetchExpenses();
    toast.success("Expense deleted successfully");
  };

  return (
    <Card className="space-y-4 p-5">
      <div className="flex justify-between items-center">
        <CardTitle className="text-2xl font-bold">Expenses</CardTitle>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Expense
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Expense</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Input
                  id="description"
                  value={newExpense.description || ""}
                  onChange={(e) =>
                    setNewExpense({
                      ...newExpense,
                      description: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="amount" className="text-right">
                  Amount
                </Label>
                <Input
                  id="amount"
                  type="number"
                  value={newExpense.amount || ""}
                  onChange={(e) =>
                    setNewExpense({
                      ...newExpense,
                      amount: parseFloat(e.target.value),
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="date" className="text-right">
                  Date
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={newExpense.date || ""}
                  onChange={(e) =>
                    setNewExpense({ ...newExpense, date: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
            </div>
            <Button onClick={handleAddExpense}>Add Expense</Button>
          </DialogContent>
        </Dialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Description</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {expenses.map((expense) => (
            <TableRow key={expense.id}>
              <TableCell>{expense.description}</TableCell>
              <TableCell>${expense.amount.toFixed(2)}</TableCell>
              <TableCell>
                {new Date(expense.date).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {expense.paid_by === currentUser.id && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setEditingExpense(expense);
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteExpense(expense.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Expense</DialogTitle>
          </DialogHeader>
          {editingExpense && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-description" className="text-right">
                  Description
                </Label>
                <Input
                  id="edit-description"
                  value={editingExpense.description}
                  onChange={(e) =>
                    setEditingExpense({
                      ...editingExpense,
                      description: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-amount" className="text-right">
                  Amount
                </Label>
                <Input
                  id="edit-amount"
                  type="number"
                  value={editingExpense.amount}
                  onChange={(e) =>
                    setEditingExpense({
                      ...editingExpense,
                      amount: parseFloat(e.target.value),
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-date" className="text-right">
                  Date
                </Label>
                <Input
                  id="edit-date"
                  type="date"
                  value={editingExpense.date}
                  onChange={(e) =>
                    setEditingExpense({
                      ...editingExpense,
                      date: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>
            </div>
          )}
          <Button onClick={handleEditExpense}>Save Changes</Button>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
