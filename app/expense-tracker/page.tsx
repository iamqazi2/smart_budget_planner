'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  addExpense,
  Budget,
  BudgetCategory,
  deleteExpense,
  ensureBudgetForMonth,
  Expense,
  getCategories,
  getExpensesForBudget,
} from '@/lib/storage';
import { Receipt, Plus, Trash2, Calendar, DollarSign } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';
import { format } from 'date-fns';

export default function ExpenseTracker() {
  const [categories, setCategories] = useState<BudgetCategory[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [currentBudget, setCurrentBudget] = useState<Budget | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [newExpense, setNewExpense] = useState({
    name: '',
    categoryId: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
  });

  const currentMonth = new Date().toISOString().slice(0, 7);

  useEffect(() => {
    setCategories(getCategories());
    const budget = ensureBudgetForMonth(currentMonth);
    setCurrentBudget(budget);
  }, []);

  useEffect(() => {
    if (currentBudget) {
      setExpenses(getExpensesForBudget(currentBudget.id));
    }
  }, [currentBudget]);

  const handleAddExpense = () => {
    if (!newExpense.name || !newExpense.categoryId || !newExpense.amount || !currentBudget) {
      toast.error('Please fill in all fields');
      return;
    }

    if (parseFloat(newExpense.amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    setLoading(true);

    try {
      addExpense({
        budget_id: currentBudget.id,
        category_id: newExpense.categoryId,
        name: newExpense.name,
        amount: parseFloat(newExpense.amount),
        expense_date: newExpense.date,
      });

      toast.success('Expense added successfully!');
      setNewExpense({
        name: '',
        categoryId: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
      });
      setIsDialogOpen(false);
      setExpenses(getExpensesForBudget(currentBudget.id));
    } catch (error) {
      console.error('Error adding expense:', error);
      toast.error('Failed to add expense');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteExpense = (id: string) => {
    try {
      deleteExpense(id);
      toast.success('Expense deleted');
      if (currentBudget) {
        setExpenses(getExpensesForBudget(currentBudget.id));
      }
    } catch (error) {
      console.error('Error deleting expense:', error);
      toast.error('Failed to delete expense');
    }
  };

  const totalExpenses = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount.toString()), 0);

  const expensesByCategory = expenses.reduce((acc, exp) => {
    const categoryName =
      categories.find((cat) => cat.id === exp.category_id)?.name || 'Unknown';
    if (!acc[categoryName]) {
      acc[categoryName] = 0;
    }
    acc[categoryName] += parseFloat(exp.amount.toString());
    return acc;
  }, {} as Record<string, number>);

  const topCategory = Object.entries(expensesByCategory).sort((a, b) => b[1] - a[1])[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Toaster />
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Expense Tracker</h1>
          <p className="text-lg text-gray-600">
            Track your expenses for {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Expense
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Expense</DialogTitle>
              <DialogDescription>
                Record a new expense to track your spending
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="expense-name">Expense Name</Label>
                <Input
                  id="expense-name"
                  placeholder="Coffee, Groceries, etc."
                  value={newExpense.name}
                  onChange={(e) => setNewExpense({ ...newExpense, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={newExpense.categoryId}
                  onValueChange={(value) => setNewExpense({ ...newExpense, categoryId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={newExpense.date}
                  onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                />
              </div>

              <Button
                onClick={handleAddExpense}
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
              >
                {loading ? 'Adding...' : 'Add Expense'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid lg:grid-cols-4 gap-6 mb-8">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-8 h-8" />
            </div>
            <p className="text-emerald-100 text-sm">Total Expenses</p>
            <p className="text-3xl font-bold">${totalExpenses.toFixed(2)}</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Receipt className="w-8 h-8 text-emerald-600" />
            </div>
            <p className="text-gray-600 text-sm">Total Transactions</p>
            <p className="text-3xl font-bold text-gray-900">{expenses.length}</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Calendar className="w-8 h-8 text-emerald-600" />
            </div>
            <p className="text-gray-600 text-sm">This Month</p>
            <p className="text-3xl font-bold text-gray-900">
              {new Date().toLocaleDateString('en-US', { month: 'short' })}
            </p>
          </CardContent>
        </Card>

        {topCategory && (
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <p className="text-gray-600 text-sm mb-2">Top Category</p>
              <p className="text-xl font-bold text-gray-900 mb-1">{topCategory[0]}</p>
              <p className="text-2xl font-bold text-emerald-600">${topCategory[1].toFixed(2)}</p>
            </CardContent>
          </Card>
        )}
      </div>

      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Recent Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          {expenses.length === 0 ? (
            <div className="text-center py-12">
              <Receipt className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No expenses recorded yet</p>
              <p className="text-gray-400">Start tracking by adding your first expense</p>
            </div>
          ) : (
            <div className="space-y-3">
              {expenses.map((expense) => {
                const IconComponent = expense.category_id
                  ? (LucideIcons as any)[
                      categories.find((cat) => cat.id === expense.category_id)?.icon ||
                        'DollarSign'
                    ] || LucideIcons.DollarSign
                  : LucideIcons.DollarSign;
                const categoryColor =
                  categories.find((cat) => cat.id === expense.category_id)?.color ||
                  '#3b82f6';

                return (
                  <div
                    key={expense.id}
                    className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors border"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${categoryColor}20` }}
                      >
                        <IconComponent className="w-6 h-6" style={{ color: categoryColor }} />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{expense.name}</p>
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                          <span>
                            {categories.find((cat) => cat.id === expense.category_id)?.name ||
                              'Unknown'}
                          </span>
                          <span>•</span>
                          <span>{format(new Date(expense.expense_date), 'MMM d, yyyy')}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="text-xl font-bold text-gray-900">
                        ${parseFloat(expense.amount.toString()).toFixed(2)}
                      </p>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteExpense(expense.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
