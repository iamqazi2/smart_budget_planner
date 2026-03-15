'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BudgetCategory,
  Budget,
  BudgetAllocation,
  Expense,
  ensureBudgetForMonth,
  getAllocationsForBudget,
  getCategories,
  getExpensesForBudget,
} from '@/lib/storage';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { TrendingUp, TrendingDown, Wallet, Receipt, CircleAlert as AlertCircle, CircleCheck as CheckCircle2 } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

export default function Dashboard() {
  const [categories, setCategories] = useState<BudgetCategory[]>([]);
  const [currentBudget, setCurrentBudget] = useState<Budget | null>(null);
  const [allocations, setAllocations] = useState<(BudgetAllocation & { category?: BudgetCategory })[]>([]);
  const [expenses, setExpenses] = useState<(Expense & { category?: BudgetCategory })[]>([]);
  const [loading, setLoading] = useState(true);

  const currentMonth = new Date().toISOString().slice(0, 7);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);

    const categoriesData = getCategories();
    setCategories(categoriesData);

    const budgetData = ensureBudgetForMonth(currentMonth);
    setCurrentBudget(budgetData);

    const allocationsData = getAllocationsForBudget(budgetData.id);
    setAllocations(
      allocationsData.map((alloc) => ({
        ...alloc,
        category: categoriesData.find((cat) => cat.id === alloc.category_id),
      }))
    );

    const expensesData = getExpensesForBudget(budgetData.id);
    setExpenses(
      expensesData.map((exp) => ({
        ...exp,
        category: categoriesData.find((cat) => cat.id === exp.category_id),
      }))
    );

    setLoading(false);
  };

  const totalIncome = currentBudget?.monthly_income || 0;
  const totalBudgeted = allocations.reduce(
    (sum, alloc) => sum + parseFloat(alloc.allocated_amount.toString()),
    0
  );
  const totalExpenses = expenses.reduce(
    (sum, exp) => sum + parseFloat(exp.amount.toString()),
    0
  );
  const remainingBalance = totalIncome - totalExpenses;

  const categorySpending = allocations.map((alloc) => {
    const categoryExpenses = expenses
      .filter((exp) => exp.category_id === alloc.category_id)
      .reduce((sum, exp) => sum + parseFloat(exp.amount.toString()), 0);

    const allocated = parseFloat(alloc.allocated_amount.toString());
    const percentage = allocated > 0 ? (categoryExpenses / allocated) * 100 : 0;

    return {
      category: alloc.category?.name || 'Unknown',
      allocated,
      spent: categoryExpenses,
      remaining: allocated - categoryExpenses,
      percentage,
      color: alloc.category?.color || '#3b82f6',
      icon: alloc.category?.icon || 'DollarSign',
      isOverBudget: categoryExpenses > allocated,
    };
  });

  const spendingChartData = categorySpending.map((cat) => ({
    name: cat.category,
    Budgeted: cat.allocated,
    Spent: cat.spent,
  }));

  const distributionChartData = categorySpending
    .filter((cat) => cat.spent > 0)
    .map((cat) => ({
      name: cat.category,
      value: cat.spent,
      color: cat.color,
    }));

  const topSpendingCategory = categorySpending.sort((a, b) => b.spent - a.spent)[0];
  const overBudgetCategories = categorySpending.filter((cat) => cat.isOverBudget);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <p className="text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!currentBudget || totalIncome === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <Wallet className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Budget Set</h2>
          <p className="text-gray-600 mb-6">
            Set up your monthly budget first to see your financial dashboard
          </p>
          <a
            href="/budget-planner"
            className="inline-flex items-center px-6 py-3 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-medium hover:from-emerald-700 hover:to-teal-700"
          >
            Create Budget
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Financial Dashboard</h1>
        <p className="text-lg text-gray-600">
          Overview for {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Wallet className="w-8 h-8" />
              {remainingBalance >= 0 ? (
                <TrendingUp className="w-6 h-6" />
              ) : (
                <TrendingDown className="w-6 h-6" />
              )}
            </div>
            <p className="text-emerald-100 text-sm">Remaining Balance</p>
            <p className="text-3xl font-bold">${remainingBalance.toFixed(2)}</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 text-emerald-600" />
            </div>
            <p className="text-gray-600 text-sm">Monthly Income</p>
            <p className="text-3xl font-bold text-gray-900">${totalIncome.toFixed(2)}</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Receipt className="w-8 h-8 text-emerald-600" />
            </div>
            <p className="text-gray-600 text-sm">Total Expenses</p>
            <p className="text-3xl font-bold text-gray-900">${totalExpenses.toFixed(2)}</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Wallet className="w-8 h-8 text-emerald-600" />
            </div>
            <p className="text-gray-600 text-sm">Budgeted Amount</p>
            <p className="text-3xl font-bold text-gray-900">${totalBudgeted.toFixed(2)}</p>
          </CardContent>
        </Card>
      </div>

      {overBudgetCategories.length > 0 && (
        <Card className="border-0 shadow-lg mb-8 bg-red-50 border-red-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-red-900 mb-2">Budget Alert</p>
                <p className="text-red-700">
                  You are over budget in {overBudgetCategories.length} category
                  {overBudgetCategories.length > 1 ? 'ies' : ''}:{' '}
                  {overBudgetCategories.map((cat) => cat.category).join(', ')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Budget vs Spending</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={spendingChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(value: number) => `$${value.toFixed(2)}`}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Bar dataKey="Budgeted" fill="#10b981" radius={[8, 8, 0, 0]} />
                <Bar dataKey="Spent" fill="#14b8a6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Expense Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {distributionChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={distributionChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {distributionChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => `$${value.toFixed(2)}`}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    formatter={(value) => <span className="text-sm">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-400">
                No expenses recorded yet
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Category Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categorySpending.map((cat) => {
              const IconComponent = (LucideIcons as any)[cat.icon] || LucideIcons.DollarSign;
              return (
                <div key={cat.category} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${cat.color}20` }}
                      >
                        <IconComponent className="w-5 h-5" style={{ color: cat.color }} />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{cat.category}</p>
                        <p className="text-sm text-gray-500">
                          ${cat.spent.toFixed(2)} of ${cat.allocated.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-semibold ${cat.isOverBudget ? 'text-red-600' : 'text-emerald-600'}`}
                      >
                        {cat.percentage.toFixed(0)}%
                      </p>
                      {cat.isOverBudget ? (
                        <p className="text-xs text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          Over budget
                        </p>
                      ) : cat.percentage >= 80 ? (
                        <p className="text-xs text-amber-600">Almost there</p>
                      ) : (
                        <p className="text-xs text-gray-500">On track</p>
                      )}
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${cat.isOverBudget ? 'bg-red-500' : 'bg-emerald-500'}`}
                      style={{ width: `${Math.min(cat.percentage, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {topSpendingCategory && (
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Top Spending Category</p>
                  <p className="text-xl font-bold text-gray-900">{topSpendingCategory.category}</p>
                </div>
              </div>
              <p className="text-3xl font-bold text-emerald-600">
                ${topSpendingCategory.spent.toFixed(2)}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {topSpendingCategory.percentage.toFixed(0)}% of budget
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Budget Summary</p>
                  <p className="text-xl font-bold text-gray-900">
                    {totalExpenses > 0 ? ((totalExpenses / totalIncome) * 100).toFixed(0) : 0}% Used
                  </p>
                </div>
              </div>
              <p className="text-gray-700">
                You've spent{' '}
                <span className="font-bold text-emerald-600">${totalExpenses.toFixed(2)}</span> of
                your <span className="font-bold">${totalIncome.toFixed(2)}</span> monthly income.
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
