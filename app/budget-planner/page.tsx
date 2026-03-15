'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Budget,
  BudgetCategory,
  BudgetAllocation,
  ensureBudgetForMonth,
  getAllocationsForBudget,
  getCategories,
  saveBudget,
  setAllocationsForBudget,
} from '@/lib/storage';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Wallet, Plus, Save, TrendingDown } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';

export default function BudgetPlanner() {
  const [categories, setCategories] = useState<BudgetCategory[]>([]);
  const [monthlyIncome, setMonthlyIncome] = useState<string>('');
  const [allocations, setAllocations] = useState<Record<string, string>>({});
  const [currentBudget, setCurrentBudget] = useState<Budget | null>(null);
  const [loading, setLoading] = useState(false);

  const currentMonth = new Date().toISOString().slice(0, 7);

  useEffect(() => {
    setCategories(getCategories());
    loadCurrentBudget();
  }, []);

  const loadCurrentBudget = () => {
    const budget = ensureBudgetForMonth(currentMonth);
    setCurrentBudget(budget);
    setMonthlyIncome(budget.monthly_income.toString());

    const storedAllocations = getAllocationsForBudget(budget.id);
    const allocationMap: Record<string, string> = {};
    storedAllocations.forEach((alloc) => {
      allocationMap[alloc.category_id] = alloc.allocated_amount.toString();
    });

    setAllocations(allocationMap);
  };

  const handleSaveBudget = () => {
    if (!monthlyIncome || parseFloat(monthlyIncome) <= 0) {
      toast.error('Please enter a valid monthly income');
      return;
    }

    if (!currentBudget) return;

    setLoading(true);

    try {
      const updatedBudget: Budget = {
        ...currentBudget,
        monthly_income: parseFloat(monthlyIncome),
        updated_at: new Date().toISOString(),
      };

      saveBudget(updatedBudget);
      setCurrentBudget(updatedBudget);

      const allocationsToSave: BudgetAllocation[] = Object.entries(allocations)
        .filter(([_, amount]) => amount && parseFloat(amount) > 0)
        .map(([categoryId, amount]) => ({
          id: crypto.randomUUID(),
          budget_id: updatedBudget.id,
          category_id: categoryId,
          allocated_amount: parseFloat(amount),
          created_at: new Date().toISOString(),
        }));

      setAllocationsForBudget(updatedBudget.id, allocationsToSave);

      toast.success('Budget saved successfully!');
    } catch (error) {
      console.error('Error saving budget:', error);
      toast.error('Failed to save budget');
    } finally {
      setLoading(false);
    }
  };

  const totalAllocated = Object.values(allocations).reduce(
    (sum, amount) => sum + (parseFloat(amount) || 0),
    0
  );

  const remaining = parseFloat(monthlyIncome || '0') - totalAllocated;
  const incomeValue = parseFloat(monthlyIncome || '0');
  const percentageAllocated = incomeValue > 0 ? (totalAllocated / incomeValue) * 100 : 0;

  const chartData = categories
    .filter((cat) => allocations[cat.id] && parseFloat(allocations[cat.id]) > 0)
    .map((cat) => ({
      name: cat.name,
      value: parseFloat(allocations[cat.id]),
      color: cat.color,
    }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Toaster />
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Budget Planner</h1>
        <p className="text-lg text-gray-600">
          Plan your monthly budget for {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-emerald-600" />
                Monthly Income
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="income">Enter your monthly income</Label>
                <Input
                  id="income"
                  type="number"
                  placeholder="5000"
                  value={monthlyIncome}
                  onChange={(e) => setMonthlyIncome(e.target.value)}
                  className="text-lg"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-600" />
                Budget Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categories.map((category) => {
                  const IconComponent = (LucideIcons as any)[category.icon] || LucideIcons.DollarSign;
                  return (
                    <div key={category.id} className="flex items-center gap-4">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${category.color}20` }}
                      >
                        <IconComponent className="w-5 h-5" style={{ color: category.color }} />
                      </div>
                      <div className="flex-1">
                        <Label htmlFor={category.id} className="text-base font-medium">
                          {category.name}
                        </Label>
                      </div>
                      <div className="w-32">
                        <Input
                          id={category.id}
                          type="number"
                          placeholder="0"
                          value={allocations[category.id] || ''}
                          onChange={(e) =>
                            setAllocations({ ...allocations, [category.id]: e.target.value })
                          }
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <Button
                onClick={handleSaveBudget}
                disabled={loading}
                className="w-full mt-6 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                size="lg"
              >
                <Save className="w-4 h-4 mr-2" />
                {loading ? 'Saving...' : 'Save Budget'}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <p className="text-emerald-100 text-sm">Monthly Income</p>
                  <p className="text-3xl font-bold">${incomeValue.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-emerald-100 text-sm">Total Allocated</p>
                  <p className="text-2xl font-semibold">${totalAllocated.toFixed(2)}</p>
                </div>
                <div className="pt-4 border-t border-emerald-400">
                  <p className="text-emerald-100 text-sm">Remaining</p>
                  <p className={`text-2xl font-bold ${remaining < 0 ? 'text-red-200' : ''}`}>
                    ${remaining.toFixed(2)}
                  </p>
                  {remaining < 0 && (
                    <p className="text-red-200 text-xs mt-1 flex items-center gap-1">
                      <TrendingDown className="w-3 h-3" />
                      Over budget
                    </p>
                  )}
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-emerald-100">Allocated</span>
                    <span>{percentageAllocated.toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-emerald-700/30 rounded-full h-2">
                    <div
                      className="bg-white rounded-full h-2 transition-all duration-300"
                      style={{ width: `${Math.min(percentageAllocated, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {chartData.length > 0 && (
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Budget Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={320}>
                  <PieChart margin={{ top: 16, right: 0, bottom: 60, left: 0 }}>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="45%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
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
                      height={48}
                      formatter={(value) => <span className="text-sm">{value}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
